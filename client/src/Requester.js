export default class ApiRequester {

    constructor(method, url, body){
        this.method = method;
        this.url = 'http://localhost:8080' + url;
        this.body = body;
    }

    call(){
        const options ={
            method: this.method,
            header:{
            },
        }
        return (fetch(this.url, options));
    }
}