   /* GLOBAL */ 

   const tbl = document.querySelector('#tbl')
   let grid = []
   const pointer = new Object
       pointer.click = false
   const play = new Object
       play.score = 0
       play.level = 0
       play.over = false
       play.hiscore = ''
       
   /* FUNCTIONS */

    function score(json=''){
        const data = new URLSearchParams();           
            json !='' ? data.append("json", JSON.stringify(json)) : 0
    
        const myRequest = new Request("score.php",{
            method : "POST",
            body : data
        });
    
        fetch(myRequest)
        .then(function (response){
            if (response.status === 200) { 
                response.text().then((txt)=>{
                    play.hiscore = JSON.parse(txt)
                    if(play.hiscore.length > 0){
                        document.querySelector('#lblHiScore').innerHTML = play.hiscore[0].nome + ' '+ play.hiscore[0].score.toString().padStart(5,'0')
                    }
                })
            } 
        })            
    }
   
    function updateScore(){
        if(play.score > play.hiscore[0].score){
            document.querySelector('#lblHiScore').innerHTML = 'NEW RECORD '+ play.score.toString().padStart(5,'0')
        }


    }


   function start(N){
       const num = []
       for(let i=0; i<N; i++){
           num.push(i%9 +1)
       }
       let i=0
       while(num.length>0){
           const y = Math.floor(i/9)
           const x = i%9 + 1
           const index = Math.floor(Math.random() * num.length)
           const obj = new Object
           obj.num = num[index]
           obj.live = true
           num.splice(index,1)
           if(grid.length<y+1){
               grid.push([])
           }
           !play.over ? grid[y].push(obj) : 0
           i++
       }
       play.level++
       plot()
   }

   function print(){
       document.querySelector('#lblScore').innerHTML = 'Score: '+play.score
       document.querySelector('#lblLevel').innerHTML = 'Level: '+play.level
   }

   function plot(){
       tbl.innerHTML = ''

       for(let y=0; y<12; y++){
           const tr = document.createElement('tr')
           for(let x=0; x<9; x++){
               const td = document.createElement('td')
               td.className = 'cell'
               try{
                   td.innerHTML = grid[y][x].num
                   grid[y][x].live ? td.classList.remove('dead') : td.classList.add('dead')
                   td.addEventListener('click',()=>{
                       if(!pointer.click){
                           pointer.click = true
                           pointer.x = x
                           pointer.y = y
                           pointer.cell = td
                           td.classList.add('mark')
                       }else{
                           pointer.click = false
                           pointer.cell.classList.remove('mark')
                           tips(y,x)
                           check(y,x)
                       }
                   })
               }catch{
                   td.innerHTML = ''
               }
               tr.appendChild(td)
           }
           tbl.appendChild(tr)
       }
       print()
   }

   function check(y,x){

        function kill(){
            pointer.cell.classList.add('dead')
            tbl.childNodes[y].childNodes[x].classList.add('dead')
            grid[y][x].live = false
            grid[pointer.y][pointer.x].live = false
            drop()          
            play.score += play.level * 3
            updateScore()
            print()
            playSound('kill.wav')
        }

        function drop(){

            
            for(let y_=0; y_<grid.length; y_++){
                let clear = true
                for(let x_=0; x_<grid[y_].length; x_++){                
                    clear = grid[y_][x_].live ? false : clear
                }
                if(clear){
                    grid.splice(y_,1)
                    
                    y_ = 0
                    drop()
                    playSound('drop.wav')                    
                }
            }        
            plot()           
            finish()
        }

        function finish(){
            if(grid.length == 0){
                alert('Level Complete!')
                play.score += play.level * 100
                play.level++
                print()
                start(32)
            }
        } 

        const opt = tips(y,x)
        for(let i=0; i<opt.length; i++){
            if(opt[i][0] == pointer.y && opt[i][1] == pointer.x){
                kill()
            }
        }

        console.log(opt)        

   }

   function playSound(mp3){
    if(document.querySelector('#ckbSound').checked){
        var snd = new Audio(mp3); // buffers automatically when created
        snd.play();    
    }
   }


   function addLine(){
        playSound('addline.wav')

       const num = []

       for(let y=0; y<grid.length; y++){
           for(let x=0; x<grid[y].length; x++){
               grid[y][x].live ? num.push(grid[y][x].num) : 0
           }
       }
       
       let y = grid.length-1

       for(let i=0; i<num.length; i++){
           if(grid[y].length >= 9){
               grid.push([])
               y++
           }
           const obj = new Object
           obj.num = num[i]
           obj.live = true
           grid[y].push(obj)
       }

       if(grid.length > 12){
           play.over = true
           playSound('gameover.wav')
           alert('GAME OVER!!!')
           if(play.score >= play.hiscore[0].score){
            play.hiscore[0].nome = prompt('Digite Seu Nome:')
            play.hiscore[0].score = play.score
            score(play.hiscore)
           }
       }else{
           plot()
       }

   }

    function direct(y,x,_y,_x,out){

        let y_ = y + _y
        let x_ = x + _x
        runX()
        let flag = true

        function match(y_,x_){
            try{
                return (grid[y][x].num == grid[y_][x_].num || grid[y][x].num + grid[y_][x_].num == 10) && grid[y_][x_].live
            }catch{
                return false
            }
        }

        function runX(){
            if(_y == 0 && _x > 0 && x_ >= grid[y_].length){
                x_ = 0
                y_++
            }else if(_y == 0 && y_ > 0 && _x < 0 && x_ < 0){
                y_--
                x_ = grid[y_].length-1
            }

        }

        while(y_ >= 0 && y_ < grid.length && x_ >= 0 && x_ < grid[y_].length && flag){

            flag =  grid[y_][x_].live ? false : flag

            if(match(y_,x_)){
                out.push([y_,x_])
            }
            x_ = x_ + _x
            runX()
            y_ = y_ + _y            
        }
    }


    function tips(y,x){

        const out = []

        direct(y,x,1,0,out)
        direct(y,x,-1,0,out)
        direct(y,x,0,1,out)
        direct(y,x,0,-1,out)
        direct(y,x,1,1,out)
        direct(y,x,1,-1,out)
        direct(y,x,-1,1,out)
        direct(y,x,-1,-1,out)

        return out

    }


   /* BEGIN */

   start(32)
   score()