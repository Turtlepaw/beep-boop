/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import APIRoute, { Method } from "../../lib/APIRoute";
import { Routes } from "../api-types";
import { Client } from "discord.js";
import { exec } from "child_process";
import crypto from "crypto";

export default class ApiUsers extends APIRoute {
  constructor() {
    super(Routes.Github, {
      public: [Method.Post, Method.Get],
    });
  }

  async Get(
    _: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<any> {
    return res.status(200).send("This webhook is working");
  }

  async Post(
    request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    response: Response<any, Record<string, any>>,
    client: Client<boolean>
  ): Promise<any> {
    const payload = request.body;
    const incomingSignature = request.headers["x-hub-signature-256"]; // GitHub sends the signature in this header

    // Check if the signature is valid
    if (!validateGitHubSignature(incomingSignature, payload)) {
      console.error(
        `Verification has `.gray + `failed`.red + ` (from ${request?.ip})`.gray
      );
      return response.status(403).send("Invalid GitHub signature");
    } else console.log(`Verification has `.gray + `passed!`.green);

    // Respond to the GitHub webhook immediately
    response
      .status(200)
      .send("Webhook received, processing commands in the background");

    // Handle the webhook asynchronously
    try {
      const result = await handleWebhook(payload, client);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

const githubToken = process.env.GITHUB_TOKEN;
async function handleWebhook(payload, client: Client) {
  return new Promise((resolve, reject) => {
    // Execute git pull, yarn build, pm2 restart all, and pm2 log
    console.log("Pulling new source");
    client.destroy();
    exec("git pull && yarn build && pm2 restart BeepBoop", (error, stdout) => {
      if (error) {
        console.error(`Error executing commands: ${error.message}`);
        reject("Internal Server Error");
      }
      console.log(`Commands executed successfully: ${stdout}`);
      resolve("Commands executed successfully");
    });
  });
}

function validateGitHubSignature(incomingSignature, payload) {
  const hmac = crypto.createHmac("sha256", githubToken);
  const expectedSignature = `sha256=${hmac
    .update(JSON.stringify(payload))
    .digest("hex")}`;

  return incomingSignature === expectedSignature;
}
