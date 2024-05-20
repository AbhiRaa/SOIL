const db = require("../database");

// Select one user from the database.
exports.one = async (req, res) => {
    const user = await db.user.findByPk(req.params.email);
    console.log(user)
    res.json(user);
    
  };

// Create a user in the database.
exports.create = async (req, res) => {
    const user = await db.user.create({
      username: req.body.name,
      email: req.body.email,
      password: req.body.password,
      salt:req.body.salt,
      joinDate:req.body.joinDate,
      Age:req.body.profile.age,
      Weight:req.body.profile.weight,  
      Height:req.body.profile.height,
      Gender:req.body.profile.gender,
      Activity_Level: req.body.profile.activityLevel,
      Dietary_Preferences: JSON.stringify(req.body.profile.dietaryPreferences),
      Health_Goals:JSON.stringify(req.body.profile.healthGoals),
    });
  
    res.json(user);
  };

exports.delete = async(req,res)=>{
  try {
    const result = await db.user.destroy({
        where: { email: req.params.email }
    });
    if (result > 0) {
        res.status(200).send({ message: "User deleted successfully" });
    } else {
        res.status(404).send({ message: "User not found" });
    }
} catch (error) {
    res.status(500).send({ message: "Error deleting user", error: error.message });
}
};

exports.update = async(req,res)=>{
  const [affectedCount] = await db.user.update(req.body, {where:{email:req.params.email}});
  if(affectedCount>0){
    res.status(200).send({message:"updated user successfully"})
  }
  else{
    res.status(404).send({ message: "User not found" });
  }
}