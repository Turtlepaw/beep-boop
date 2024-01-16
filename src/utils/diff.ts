/* eslint-disable prefer-const */
export function compareStrings(str1: string, str2: string): string {
    // Split the strings into words by space
    let words1 = str1.split(" ");
    let words2 = str2.split(" ");
    // Initialize an empty array to store the diff output
    let diff = [];
    let diffPlus = [];
    let diffMinus = [];
    // Loop through the longer array of words
    let long = words1.length > words2.length ? words1 : words2;
    for (let i = 0; i < long.length; i++) {
        // If the words are equal, push them to the diff array without any sign
        if (words1[i] === words2[i]) {
            diff.push(words1[i]);
        }
        else {
            // If the word is in words1 but not in words2, push it with a minus sign
            if (words1[i] && !words2.includes(words1[i])) {
                diffMinus.push(words1[i]);
            }
            // If the word is in words2 but not in words1, push it with a plus sign
            if (words2[i] && !words1.includes(words2[i])) {
                diffPlus.push(words2[i]);
            }
        }
    }
    // Join the diff array with newlines and return it
    return ["- " + diffMinus.join(" "), "+ " + diffPlus.join(" ")].join("\n");
}

compareStrings("hi", "hi 2")