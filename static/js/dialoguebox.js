import { AnimatedSprite } from "./animations.js"
/* 
La idea de implementar los dialogos como clase y objeto manejable y reutilizable
En vez de trabajarlo para un simple caso viene simplemente de la idea que si se
Implementan los eventos de catrastofres se pueda reutilizar esto.
*/

export class DialogueBox {
    constructor(
        author, 
        dialogues,
        finish // funcion que se ejecuta al finalizar los dialogos
    ) {
        this.author = author;
        this.dialogues = dialogues;
        this.finish = finish || (() => {});
        this.currentText = "Hola Como estas"; //this.dialogues[0];

        this.textcontainer = document.getElementById("textcontainer");
        this.textbox = document.getElementById("textbox");
        this.textC = document.getElementById("textC")
        this.ctx = this.textC.getContext("2d");
        
        this.typingTimer = null;
        this.textIndex = 0; // Índice global del caracter a dibujar
        this.wrappedLines = []; // Líneas después del wrapText

        const FPS = 60;
        const FRAME_DURATION = 1000 / FPS;
        
        const img = new Image();
        img.src = dialoguePath;
        
        
        // Llamamos a la funcion de animations.js para empezar la animación
        this.anim = new AnimatedSprite({
            canvas: this.textbox,
            img: img,
            frameWidth: 80,
            frameHeight: 30,
            frameCount: 1,
            gridCols: 1,
            frameDuration: FRAME_DURATION,
            //onFrameRendered: this.renderText.bind(this)
        });

        this.anim.start();
        this.textcontainer.style.opacity = "1";
        //this.anim.stop();
        this.ctx.clearRect(0, 0, this.textC.width, this.textC.height)
        
        // Mini configuraciones
        this.fontsize = 18;
        this.lineHeight = this.fontsize + 10;
        this.margenesX = 40;
        this.margenesY = 80;
        this.maxTextWidth = this.textC.width - (this.margenesX * 2);
    }

    wrapText(max) {
    /* Volvimos a la documentacion porque avance mucho sin comentar nada
       Esta funcion permite calcular la posicion de cada palabra haciendo
       lo que se conoce como text wrapping, basicamente provamos que la palabra
       encaje en una linea si alguna palabra supera nuestro maximo entonces 
       la mandamos para abajo, estilo lo que hace word.
    */

        this.ctx.font = this.fontsize + 'px "Press Start 2P"'; // espero no quieran cambiar la fuente a futuro

        let words = this.currentText.split(" ");
        let lines = [];
        let curLine = '';

        words.forEach(word => {
            let test = curLine.length > 0 ? curLine + " " + word : word; // Probamos la linea con la nueva palabra o la palabra sola si no hay linea aun
            let medidas = this.ctx.measureText(test);

            if (medidas.width > max && curLine.length > 0) {
                lines.push(curLine);
                curLine = word;
            } else {
                curLine = test;
            }
        });

        lines.push(curLine);
        console.log(lines);
        return lines;
    }

    renderText(text) {
        if (!this.currentText) return;
        
        this.ctx.clearRect(0, 0, this.textC.width, this.textC.height);
        
        this.ctx.font = '18px "Press Start 2P"';
        this.ctx.fillStyle = "#000000ff";
        console.log(this.author)
        this.ctx.fillText(this.author, this.margenesX+20, 33);

        this.ctx.font = this.fontsize + 'px "Press Start 2P"';
        this.ctx.fillStyle = "#ffffffff";
        
        let charsDrawn = 0;
        const maxChars = this.textIndex; // El límite de caracteres a dibujar

        for (let i = 0; i < this.wrappedLines.length; i++){
            const line = this.wrappedLines[i];
            
            let ypos = this.margenesY + (this.lineHeight * i); // Posición Y de la línea
            
            // Si el índice actual (maxChars) está dentro de esta línea...
            if (charsDrawn + line.length + 1 > maxChars) {
                // ... dibujar solo la parte visible de esta línea
                const part = line.substring(0, maxChars - charsDrawn);
                this.ctx.fillText(part, this.margenesX, ypos);
                break; // Terminamos, hemos alcanzado el límite de escritura
            } else {
                // ... dibujar la línea completa (ya se terminó de escribir)
                if (line.length > 0) {
                    this.ctx.fillText(line, this.margenesX, ypos);
                }
                
                charsDrawn += line.length;
                charsDrawn += 1; // Contar el salto de línea implícito/explícito
            }
        }
    }
    
    startTyping(textSpeed) {
        if (this.typingTimer) clearInterval(this.typingTimer); // Limpiar cualquier temporizador anterior

        // 1. Calcular el índice total donde debe terminar la escritura
        let charCount = 0;
        // Asumimos que hay un carácter extra (salto) por cada línea
        for (const line of this.wrappedLines) {
            charCount += line.length + 1; 
        }
        const finalIndexTarget = charCount - 1; 

        // 2. Iniciar el temporizador
        this.typingTimer = setInterval(() => {
            this.textIndex++; // Avanzamos al siguiente carácter
            this.renderText(); // Forzamos el redibujo

            // 3. Condición de Parada
            if (this.textIndex >= finalIndexTarget) {
                clearInterval(this.typingTimer);
                this.typingTimer = null;
                this.finish(); 
            }
        }, textSpeed); // textSpeed es el tiempo entre cada carácter (e.g., 50ms)
    }

    enable() {
        this.textcontainer.style.opacity = "1";
    }

    disable() {
        this.textcontainer.style.opacity = "0";
        if (this.typingTimer) clearInterval(this.typingTimer);
    }

    write() {
        let textSpeed = 50;
        let dialogueIndex = 0;
        
        // Si ya hay un diálogo escribiéndose, salta al final
        if (this.typingTimer) {
             clearInterval(this.typingTimer);
             this.typingTimer = null;
             // Forzamos el índice al final y redibujamos
             let charCount = this.wrappedLines.reduce((sum, line) => sum + line.length + 1, 0);
             this.textIndex = charCount;
             this.renderText(); 
             return;
        }

        this.currentText = this.dialogues.length > 0 ? this.dialogues[dialogueIndex] : this.currentText;
        this.textIndex = 0; 
        
        // 1. Calcular las líneas ajustadas
        this.wrappedLines = this.wrapText(this.maxTextWidth, this.currentText);
        
        // 2. Iniciar el efecto de máquina de escribir
        this.startTyping(textSpeed);
    }
    
    next() {
        this.dialogues.shift();
        this.currentText = this.dialogues[0];
    }
}