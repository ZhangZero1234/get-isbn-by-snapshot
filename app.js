var express = require("express");
var fs = require("fs");
var request = require("request");
var app = express();
var Quagga = require("quagga").default;
var formidable = require("formidable");
app.use(express.static("./"));
app.listen("1324",function(){
	console.log("port 3000 listening");
});
app.get("/",function(req,res,next){

});
app.post("/dopost",function(req,res,next){

		var form = new formidable.IncomingForm();
		form.uploadDir = "./temp";
		form.parse(req,function(err,fields,files){
			// console.log(fields);
			// console.log(files);
			if(err)
			{
				return;
			}

		// console.log("./"+files.fileName.path);
		// console.log("./"+files.fileName.path+".jpg");
		var oldPath="./"+files.fileName.path;
		var newPath = "./"+files.fileName.path+".jpg";
		fs.rename(oldPath,newPath,function(err){
			if(err)
			{
				return;
			}
			fs.readdir("./temp",function(err,result){
				if(err)
				{	
					throw error(err);
				}
				if(result.length>=0)
				{
					// if(result.length == 1)
					// {
					// 	fs.unlinkSync("./temp/"+result[0]);
					// }
					// for(var i = result.length-1 ; i > 0;i--)
					// {
					// 	fs.unlinkSync("./temp/"+result[i]);
					// }
				}

				Quagga.decodeSingle({
				    src: newPath,
				    numOfWorkers: 0,  // Needs to be 0 when used within node
				    inputStream: {
				        size: 800  // restrict input-size to be 800px in width (long-side)
				    },
				    decoder: {
				        readers: ["ean_reader"] // List of active readers
				    },
				}, function(result) {
					console.log(result.hasOwnProperty("codeResult"));
					if(result.hasOwnProperty("codeResult"))
				    if(result.codeResult) {
				        console.log("result", result.codeResult.code);
				        request("https://api.douban.com/v2/book/isbn/"+result.codeResult.code,function (error, response, body) {
  							console.log('body:', body); // Print the HTML for the Google homepage. 
  							fs.readdir("./temp",function(err,result){
  								if(err)
								{	
									throw error(err);
								}
								for(var i = 0 ; i < result.length;i++)
								{
									fs.unlinkSync("./temp/"+result[i]);
								}
  							});
});	
				    } else {
				        console.log("not detected");
				    }
				});
			});
		});
	});
	res.redirect("/");
});