class Email{
    constructor(id,subject,sender,receivers,emailBody,importance,attachment,date) {
        this.id = id;
        this.sender = sender;
        this.subject = subject;
        this.receiver = receivers;
        this.emailBody = emailBody;
        this.attachments = attachment;
        this.date = date;
        this.importance = importance;

    }
}

export {Email}
