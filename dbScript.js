
let req= indexedDB.open("Camera",2);
let db;
let linkforDownloadBtn="";
let bd= document.querySelector("body");
        req.addEventListener("success", function(){
            db= req.result; 
        
        });
        req.addEventListener("upgradeneeded", function(){
            let accessToNotesDB= req.result;
           accessToNotesDB.createObjectStore("Gallery", {keyPath: "mID"});
          
        });
        req.addEventListener("error", function(){
            console.log("error");
        });

        function addMedia(media,type){
          if(!db)
             return;
          let obj={mID: Date.now(), media, type};
          let tx= db.transaction("Gallery","readwrite");
          let gallery= tx.objectStore("Gallery");
          gallery.add(obj);
        }

        function deleteMedia(id){
            if(!db)
            return;
         let tx= db.transaction("Gallery","readwrite");
         let gallery= tx.objectStore("Gallery");
         gallery.delete(Number(id));
        }

        function viewMedia(){
            if(!db)
               return;
            let tx= db.transaction("Gallery","readonly");
            let gallery= tx.objectStore("Gallery");
            let cursorReq= gallery.openCursor();
            cursorReq.addEventListener("success",function(){
                let cursor= cursorReq.result;
                if(cursor){
                    let mo= cursor.value;
                    let div= document.createElement("div");
                    div.classList.add("media-container");
                    if(mo.type=="video"){
                        let url= window.URL.createObjectURL(cursor.value.media);
                        linkforDownloadBtn=url;
                       div.innerHTML=`<div class="media">
                       <video src="${url}" autoplay loop controls muted></video>
                   </div>
                   <button class="download">Download</button>
                   <button class="delete" data-id="${mo.mID}">Delete</button>`
                    }
                    if(mo.type=="image"){
                        linkforDownloadBtn=cursor.value.media;
                      div.innerHTML=`<div class="media">
                      <img src=${cursor.value.media} />
                  </div>
                  <button class="download">Download</button>
                  <button class="delete" data-id="${mo.mID}">Delete</button>`
                    }

                    let downloadBtn= div.querySelector(".download");
                    downloadBtn.addEventListener("click", function(){
                    let a= document.createElement("a");
                    a.href=linkforDownloadBtn;
                    if(mo.type=="image")
                       a.download= "img.png";
                    if(mo.type=="video")
                       a.download="video.mp4";
                    a.click();
                    a.remove();
                    });

                    let deleteBtn= div.querySelector(".delete");
                    deleteBtn.addEventListener("click", function(e){
                        let id= e.currentTarget.getAttribute("data-id");
                        deleteMedia(id);
                        e.currentTarget.parentElement.remove();
                    });
                    bd.append(div);
                    cursor.continue();
                }
            })
        }