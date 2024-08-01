import type { Snowflake } from "@antibot/interactions";
import { Document } from "mongoose";
import { Nullable } from "../Common/Nullable";

export interface Tag {
    TagName: string;
    TagAuthor: Snowflake;
    TagResponse: {
        TagEmbedTitle: string;
        TagEmbedDescription: Nullable<string>;
        TagEmbedFooter: Nullable<string>;
    }
}

export interface TagDocument extends Document {
    _id: string;
    Tags: Tag[];
}
