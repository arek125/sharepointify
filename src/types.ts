export interface columnInfoI {
    staticName: String
    label: string
    defaultValue?: any
    required: Boolean,
    type: string | null,
    format?: string | null,
    userSelectionScope?: String | null,
    userSelectionMode?: String | null,
    choices?: string[],
    lookupField?: string | null,
    lookupList?: string | null
}

export interface formReadOnlyFieldsI {
    id: Number,
    created?: String,
    author?: String,
    modified?: String,
    editor?: String,
    attachmentFiles?: Object[]
}

export interface autocompleteChoiceI {
    title: String,
    value: Number
}

export interface listAttachmentI {
    FileName: string,
    ServerRelativeUrl: string
}

// export interface tableHeaderI {
//     staticName: string,
//     displayText?: string,
// }

export interface tableHeaderI {
    key: string,
    title?: string,
    type?: string,
    format?: string | null,
    sortable?: boolean,
    choices?: string[],
    align?: string
}

export interface listFilterI {
    column: string,
    op: string,
    value?: any,
    rowop: string,
    leftBr: boolean,
    rightBr: boolean
}

export interface listActionI {
    icon: string,
    color: string,
    click: Function,
    hintText: string
}