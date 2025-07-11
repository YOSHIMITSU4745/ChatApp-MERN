import Room from "../models/rooms.js";


const searchRooms = async(req,res)=>{
    const q = req.query.q || '';
    const regex = new RegExp(q,'i');

    try {
        
        const rooms = await Room.find().populate('author title');
        const filtered = rooms.
        map((room)=>{

            let score=0;

            if(regex.test(room.name)) score+=3;
            if(regex.test(room.author.username)) score+=2;

            if(regex.test(room.title.name)) score+=1;

            return {room,score}
        })
        .filter(item=> item.score>0)
        .sort((a,b)=> b.score-a.score)
        .map(item => item.room);

        res.status(200).json(filtered);


    } catch (err) {
        res.status(500).json({error:"Search Field error!"})
        
    }
};


export default searchRooms;