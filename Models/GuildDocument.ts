import type { Snowflake } from "@antibot/interactions";
import { Document } from "mongoose";
import { Nullable } from "../Common/types";

export interface GuildDocument extends Document {
    _id: Snowflake;
    SupportRoles: Snowflake[];
    Tags: Tag[];
}

export type Tag = {
    TagName: string;
    TagAuthor: Snowflake;
    TagEditedBy: Nullable<Snowflake>;
    TagResponse: {
        TagEmbedTitle: string;
        TagEmbedDescription: Nullable<string>;
        TagEmbedImageURL: Nullable<string>;
        TagEmbedFooter: Nullable<string>;
    }
}
