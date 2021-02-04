
export interface MailerResponse {
    messageId: string
}

export interface Email {
    readonly sender: string,
    readonly recipient: string,
    readonly subject: string,
    readonly messageText?: string,
    readonly messageHtml?: string,
    readonly attachments?: (Email.AttachedBuffer|Email.AttachedFile)[],
    readonly cc?: string
}

export namespace Email {
    export interface AttachedBuffer {
        readonly filename: string,
        readonly content: Buffer
    }

    export interface AttachedFile {
        readonly filename: string,
        readonly path: string
    }
}

export interface Mailer {
    send(email: Email) : Promise<MailerResponse>
}
