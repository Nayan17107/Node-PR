const http = require('http');
const fs = require('fs')

const server = http.createServer((req, res) => {
    let Filepath;

    switch (req.url) {
        case '/':
            Filepath = './home.html'
            break;
    
        case '/about':
            Filepath = './about.html'
            break;
    
        case '/contact':
            Filepath = './contact.html'
            break;
    
        default:
            Filepath = './notfound.html'
            break;
    }

    let data = fs.readFileSync(Filepath, 'utf-8')
    res.end(data)
})

server.listen(8000);
