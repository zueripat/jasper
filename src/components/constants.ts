export enum Emojis {
    RIGHT_ARROW = '<:View_As_Role_Arrow:1208276618230104084>',
    CHECK_MARK = ':white_check_mark:',
    CROSS_MARK = '<:Cross:1208281210493734922>',
    INFO_MARK = '<:Info:1208646146382241823>'
}

export enum Colors {
    Scarlet = 0xFF1859,
    Green = 0x008000,
    Yellow = 0xFFFAA0
}

export function RightArrowStringConfig(checkMark: string, string: string): string {
    return `**${checkMark} ${Emojis.RIGHT_ARROW} ${string}**`;
}
