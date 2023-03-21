
const Task = require('../models/task')
const express = require ('express')
const { findById, findOneAndDelete } = require('../models/user')
const router = new express.Router()
const auth = require ('../middleware/auth')
const { request } = require('express')
// GET /tasks?completed=false
// GET /tasks?limit=10&skip=10
// limit skip

// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] ==='desc' ? -1 : 1
        
    }
    try {
        // const tasks = await Task.find({owner: req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
            })

        const tasks = req.user.tasks
        res.send(tasks)
    }catch(e){
        res.status(404).send()
    }
 
})

router.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id
try {
    // const task = await Task.findById(req.params.id)
    const task = await Task.findOne({_id, owner: req.user._id})
    res.send(task)
}catch(e){
    res.status(404).send()
}
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const allowedUpdates = ['description', 'completed']
    const requestedUpdates = Object.keys(req.body)
    const isValid = requestedUpdates.every((update) => {
       return  allowedUpdates.includes(update)
    })
    if(!isValid){
        return res.status(500).send('Not all updates are allowed')
    }
    try{

        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        console.log(task)
        // const user = await Task.findByIdAndUpdate(_id, req.body, {runValidators: true, new: true})
        if(!task){
            return res.status(400).send()
        }
        requestedUpdates.forEach((update)=>{
            task[update] = req.body[update]
    
        })
        
        await task.save();

        res.send(task)
    }catch(e){
        res.status(404).send(e)
    }
})

router.post('/tasks', auth, async (req, res) => {
    
     const task = new Task({
         ...req.body,
        owner: req.user.id
     })
    try{
        
        await task.save()
        res.send(task)
    }catch(e){
        res.status(404).send()
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
   
    try{
         const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        // const task = await Task.findByIdAndDelete(req.params.id)
        // const task = await Task.findOneAndDelete({})
    if (!task){
        return res.status(401).send()
    } 
        res.send(task)
    }catch (e) {
        res.status(400).send()
    }
})


module.exports = router