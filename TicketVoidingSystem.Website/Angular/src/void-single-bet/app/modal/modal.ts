export class Modal {
    header: string;
    body: string;
    isShow: boolean;

    open(header: string, body: string) {
        this.isShow = true;
        this.header = header;
        this.body = body;
    }

    close() {
        this.isShow = false;
    }
}