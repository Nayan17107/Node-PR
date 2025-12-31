const express = require('express');
const port = 8081;
const app = express()

app.set('view engine', 'ejs');
app.use(express.urlencoded())
app.use(express.json())

let todos = [
    { id: '1', title: 'Buy groceries', description: 'Milk, Bread, Eggs', time: '09:00' },
    { id: '2', title: 'Call Mom', description: 'Weekly check-in', time: '18:00' },
    { id: '3', title: 'Pay rent', description: 'Before 5th', time: '08:00' }
]

app.get('/', (req, res) => {
    res.render('index', { todos })
})

app.post('/add-todo', (req, res) => {
    todos.push(req.body);
    return res.redirect('/')
})

app.get('/delete-todo/:id', (req, res) => {
    const id = req.params.id
    todos = todos.filter(t => t.id !== id)
    return res.redirect('/')
})

app.get('/edit-todo/:id', (req, res) => {
    let id = req.params.id;
    todo = todos.find((t) => t.id == id);
    return res.render('edit-todo', { todo })
})

app.post('/update-todo/:id', (req, res) => {
    let id = req.params.id;

    let update = todos.map((t) => {
        if (t.id == id) {
            return {
                ...req.body,
                id: id,
            }
        } else {
            return t
        }
    })

    todos = update
    res.redirect('/')
})

app.listen(port, () => {
    console.log(`Todo server is running at http://localhost:${port}`);
});