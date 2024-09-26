window.onload = () => {
    
    function insertImage(url, width, height, positionX, positionY, id) {
        
        let img = document.createElement("img");
        img.src = url;
        img.style.width = width; 
        img.style.height = height;
        img.style.marginLeft = positionX;
        img.style.marginTop = positionY;
    
        let targetElement = document.getElementById(id);
        targetElement.innerHTML = "";
        targetElement.appendChild(img);
    }
    
    function insertText(content, size, positionX, positionY, id){
        let element = document.getElementById(id);
        element.innerHTML = "";
        element.innerText = content;
        element.style.fontSize = size;
        element.style.fontFamily = "simsun";
        element.style.marginLeft = positionX;
        element.style.marginTop = positionY;
    }



    textArray = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"]

    setInterval(modifySpanBackground, 1000);

    function modifySpanBackground() {
        const date = new Date();
        timeString = date.toLocaleTimeString();
        timeday = date.getDate();
        timemon = date.getMonth();
        timeyear = date.getFullYear();
        hou1 = timeString[0];
        hou2 = timeString[1];
        min1 = timeString[3];
        min2 = timeString[4];
        second1 = timeString[6];
        second2 = timeString[7];
        day1 = Math.floor(timeday/10);
        day2 = timeday % 10;
        mon1 = Math.floor((timemon + 1)/10);
        mon2 = (timemon + 1) % 10;
        year1 = Math.floor(timeyear/1000);
        year2 = (Math.floor(timeyear/100))%10;
        year3 = ((Math.floor(timeyear/10))%100)%10;
        year4 = ((timeyear % 1000)%100)%10;
        texthou1 = textArray[hou1];
        texthou2 = textArray[hou2];
        textmin1 = textArray[min1];
        textmin2 = textArray[min2];
        textsec1 = textArray[second1];
        textsec2 = textArray[second2];
        textday1 = textArray[day1];
        textday2 = textArray[day2];
        textmon1 = textArray[mon1];
        textmon2 = textArray[mon2];
        textyear1 = textArray[year1];
        textyear2 = textArray[year2];
        textyear3 = textArray[year3];
        textyear4 = textArray[year4];


        if (second1 == 0 || second1 == 3 && second2 == 0){
            insertImage("images/sub4.png", "70px", "85px","70.5vw","15vw","sub7-1");
            insertText("艹", "50px", "71vw", "22vw", "sub7-2")
            insertText("勹", "80px", "70vw", "23.2vw", "sub7-3")
            insertText(textmin1, "40px", "71vw", "24.5vw", "subt7-1")
            insertText("艹", "50px", "71vw", "29vw", "sub7-4")
            insertText("勹", "80px", "70vw", "30.2vw", "sub7-5")
            insertText(textmin2, "40px", "71vw", "31.5vw", "subt7-2")
            insertText("艹", "50px", "86.5vw", "14.5vw", "sub7-6")
            insertText("勹", "80px", "85.5vw", "15.5vw", "sub7-7")
            insertText(textsec1, "40px", "86.5vw", "17vw", "subt7-3")
            insertText("艹", "50px", "86.5vw", "22vw", "sub7-8")
            insertText("勹", "80px", "85.5vw", "23.2vw", "sub7-9")
            insertText(textsec2, "40px", "86.5vw", "24.5vw", "subt7-4")
            insertImage("images/sub5.png", "70px", "70px","85.5vw","30.2vw","sub7-10");

            insertText(textsec2, "0px", "89vw", "24.5vw", "subt1-2")
            insertText(textsec1, "0px", "83.8vw", "24vw", "subt1-1")
            insertImage("images/sub1.png", "0px", "0px","82.5vw","22.5vw","sub1-1");
            insertText("木", "0px", "83.8vw", "19.5vw", "sub1-2")
            insertText("上", "0px", "89vw", "20.5vw", "sub1-3")

            insertText(textsec1, "0px", "88.5vw", "18.5vw", "subt1-2")
            insertText(textsec2, "0px", "85vw", "23.5vw", "subt1-1")
            insertImage("images/sub2.png", "0px", "0px","82vw","22.5vw","sub1-1");
            insertText("勹", "0px", "83vw", "20.5vw", "sub1-2")
            insertText("大", "0px", "85.5vw", "18.5vw", "sub1-3")
        }

        else if(second2 < 5){
            insertText(textsec2, "60px", "89vw", "24.5vw", "subt1-2")
            insertText(textsec1, "80px", "83.8vw", "24vw", "subt1-1")
            insertImage("images/sub1.png", "150px", "140px","82.5vw","22.5vw","sub1-1");
            insertText("木", "80px", "83.8vw", "19.5vw", "sub1-2")
            insertText("上", "60px", "89vw", "20.5vw", "sub1-3")

            insertImage("images/sub4.png", "0px", "0px","70.5vw","15vw","sub7-1");
            insertText("艹", "0px", "71vw", "22vw", "sub7-2")
            insertText("勹", "0px", "70vw", "23.2vw", "sub7-3")
            insertText(textmin1, "0px", "71vw", "24.5vw", "subt7-1")
            insertText("艹", "0px", "71vw", "29vw", "sub7-4")
            insertText("勹", "0px", "70vw", "30.2vw", "sub7-5")
            insertText(textmin2, "0px", "71vw", "31.5vw", "subt7-2")
            insertText("艹", "0px", "86.5vw", "14.5vw", "sub7-6")
            insertText("勹", "0px", "85.5vw", "15.5vw", "sub7-7")
            insertText(textsec1, "0px", "86.5vw", "17vw", "subt7-3")
            insertText("艹", "0px", "86.5vw", "22vw", "sub7-8")
            insertText("勹", "0px", "85.5vw", "23.2vw", "sub7-9")
            insertText(textsec2, "0px", "86.5vw", "24.5vw", "subt7-4")
            insertImage("images/sub5.png", "0px", "0px","85.5vw","30.2vw","sub7-10");
        }
        else{
            insertText(textsec1, "60px", "88.5vw", "18.5vw", "subt1-2")
            insertText(textsec2, "95px", "85vw", "23.5vw", "subt1-1")
            insertImage("images/sub2.png", "40px", "110px","82vw","22.5vw","sub1-1");
            insertText("勹", "180px", "83vw", "20.5vw", "sub1-2")
            insertText("大", "60px", "85.5vw", "18.5vw", "sub1-3")
        }

        if (second1 == 0 || second1 == 3 && second2 == 0){
            insertText(textmin1, "0px", "73.5vw", "18.5vw", "subt2-2")
            insertText(textmin2, "0px", "70vw", "23.5vw", "subt2-1")
            insertText("木", "0px", "73.5vw", "21vw", "sub2-1")
            insertText("勹", "0px", "68vw", "20.5vw", "sub2-2")
            insertText("大", "0px", "69.5vw", "18.5vw", "sub2-3")
            insertImage("images/sub2.png", "0px", "0px","67vw","23vw","sub2-4");

            insertText(textmin1, "0px", "72.8vw", "20vw", "subt2-2")
            insertText(textmin2, "0px", "69.8vw", "23.5vw", "subt2-1")
            insertImage("images/sub1.png", "0px", "0px","68vw","22vw","sub2-4");
            insertText("大", "0px", "69.8vw", "20vw", "sub2-2")
            insertText("", "0px", "76.5vw", "20.5vw", "sub2-1")
            insertText("", "0px", "76.5vw", "20.5vw", "sub2-3")
        }
        else if(min2 < 5){
            insertText(textmin1, "45px", "73.5vw", "18.5vw", "subt2-2")
            insertText(textmin2, "95px", "70vw", "23.5vw", "subt2-1")
            insertText("木", "45px", "73.5vw", "21vw", "sub2-1")
            insertText("勹", "180px", "68vw", "20.5vw", "sub2-2")
            insertText("大", "70px", "69.5vw", "18.5vw", "sub2-3")
            insertImage("images/sub2.png", "0px", "0px","67vw","23vw","sub2-4");
        }
        else{
            insertText(textmin1, "60px", "72.8vw", "20vw", "subt2-2")
            insertText(textmin2, "85px", "69.8vw", "23.5vw", "subt2-1")
            insertImage("images/sub1.png", "150px", "140px","68vw","22vw","sub2-4");
            insertText("大", "60px", "69.8vw", "20vw", "sub2-2")
            insertText("", "60px", "76.5vw", "20.5vw", "sub2-1")
            insertText("", "60px", "76.5vw", "20.5vw", "sub2-3")
        }

        insertText(texthou1, "70px", "57.5vw", "19vw", "subt3-2")
        insertText(texthou2, "90px", "54.7vw", "27.2vw", "subt3-1")
        insertImage("images/sub3.png", "150px", "100px","53.5vw","23vw","sub3-1");
        insertText("夕", "70px", "53.5vw", "19vw", "sub3-2")

        insertText(textday1, "70px", "42.5vw", "18.5vw", "subt4-2")
        insertText(textday2, "95px", "39vw", "23.5vw", "subt4-1")
        insertText("勹", "180px", "37vw", "20.5vw", "sub4-1")
        insertText("大", "70px", "38.5vw", "18.5vw", "sub4-2")

        insertText(textmon1, "60px", "21vw", "25.5vw", "subt5-1")
        insertText(textmon2, "110px", "25.8vw", "23vw", "subt5-2")
        insertImage("images/sub1.png", "150px", "140px","24.5vw","22.5vw","sub5-1");
        insertText("艹", "130px", "24.8vw", "18.5vw", "sub5-2")
        insertText("上", "60px", "21vw", "21.5vw", "sub5-3")

        insertText(textyear1, "70px", "10vw", "18.5vw", "subt6-2")
        insertText(textyear2, "95px", "7vw", "23.5vw", "subt6-1")
        insertText(textyear3, "55px", "14.2vw", "23.5vw", "subt6-3")
        insertText(textyear4, "55px", "14.2vw", "26vw", "subt6-4")
        insertText("勹", "180px", "5vw", "20.5vw", "sub6-1")
        insertText("大", "70px", "6.5vw", "18.5vw", "sub6-2")
        insertText("午", "55px", "14.2vw", "18.5vw", "sub6-3")
        insertText("上", "55px", "14.2vw", "21vw", "sub6-4")

    }
}
