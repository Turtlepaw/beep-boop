import { CSSProperties } from "react";

export interface MentionableProperties {
    className?: string;
}

export interface RoleProperties extends MentionableProperties {
    children: string;
    Color?: string;
}

export interface Styling {
    Background: CSSProperties;
}

export interface RoleStyling extends Styling {
    Text: CSSProperties;
}

export class Mentions {
    static Role({ children: Name, Color, className }: RoleProperties) {
        const Styles: RoleStyling = {
            Background: {
                borderRadius: "500rem",
                backgroundColor: Color ?? "#292b2f"
            },
            Text: {
                fontWeight: 500
            }
        }

        return (
            <div style={Styles.Background} className={className}>
                <div style={Styles.Text}>{Name}</div>
            </div>
        );
    }
}