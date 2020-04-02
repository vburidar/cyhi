export default class ApiRequester {

    constructor(method, url, body){
        this.method = method;
        this.url = new URL('http://localhost:8080' + url);
        this.body = body;
    }

    addParams(params){
        Object.keys(params).forEach(key => this.url.searchParams.append(key, params[key]));
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