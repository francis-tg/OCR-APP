<template>
    <div class="container">
            
            <div class="file-input-container">
                
                <div class="ico">
                    <ios-cloud-upload-icon   />
                </div>
                <input type="file" class="file"  @change="upload" accept="image/*">
            </div>
            
            <div  class="preview">
                <img ref="print" src="../assets/default.jpg" id="blob" alt="">
            </div>
            <div class="action-btn" v-show="progress==='1'">
                <button class="convert-btn pdf" @click="DoPdf"></button>
                <button class="convert-btn text" @click="ExtractText"></button>
            </div>
    </div>
</template>
<script>
// import axios from 'axios'
import {createWorker,OEM,PSM} from 'tesseract.js';
import {jsPDF} from 'jspdf'
import swal from 'sweetalert';
// import { Html2CanvasOptions } from 'jspdf';
// import html2Canvas from 'vue-html2canvas';
// const A4width = 210;
// const A4height = 297;

const worker = createWorker({
    logger:m=>console.log(m)
})
const doc = new jsPDF({
                orientation:'portrait',
                unit:'pt',
                format:'A4',
                
            })
export default {
    name:"Upload",
    data() {
        return {
            file:'',
            progress:'1'
        }
    },
    methods: {
        upload(e){
            this.file = e.target.files[0];
            const blob = URL.createObjectURL(this.file)
            // console.log(this.file);
            const img = document.getElementById('blob');
            img.setAttribute('src',blob);
        },
        ShowMsg(title,msg,type,backdoor=false){
            swal({
                title:title,
                text:msg,
                icon:type,
                button:true,
                dangerMode: type ==='error'?true:false,
                closeOnClickOutside: type ==='error'||backdoor==true?false:true,
            })
        },
        
        DoPdf(){
            console.log('click')
            if(this.file)
            {
                const blob = URL.createObjectURL(this.file)
            console.log(this.file);
            // const img = document.getElementById('blob');
            // img.setAttribute('src',blob);
            // img.onload = ()=>{
            //     const width = img.width;
            //     const height = img.height;
            //     console.log(`${width}, ${height}`)
                this.imgToPdf(blob,	2480,3508)
            // }
            }else{
                this.ShowMsg('Attention', "Veuillez selectionner une image", 'error')
            }
        },
        ExtractText(){
            // console.log("click")
            if(this.file){
            swal({
                title: "Information importante !!!",
                text: "Cette partie est en cours de développement, il ne reconnait que les text en anglais pour le moment, voulez-vous continuer?",
                icon: "warning",
                buttons: ['Annuler', 'Continuer'],
                dangerMode: true,
                })
                .then(async(willDelete) => {
                if (willDelete) {
                    
                        const blob = URL.createObjectURL(this.file)
                       this.progress = '0'
                        this.ShowMsg('Information', "Veuillez patienter, travail en cour ...",'info',true)
                            
                        this.Recognizer(blob).then((res)=>{
                            console.log(res)
                            
                            this.Convert(res)
                            this.progress = '1'
                            this.ShowMsg('Information', "Votre fichier a été générer avec success !!", 'success')
                        })
                    
                } else {
                    swal("Vous avez annulé cette opération, rééssayer une autre! Merci!");
                }
                });
                }else{
                        this.ShowMsg('Attention', "Veuillez selectionner une image", 'error')
                    }
            
        },
        Recognizer:async(img)=>{
            
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.loadLanguage('eng',OEM.DEFAULT);
            await worker.initialize('eng');
            await worker.setParameters({
                tessedit_pageseg_mode:PSM.SINGLE_BLOCK
            })
            const {data:{text}}=await worker
            .recognize(img,{tessjs_create_pdf:"1"})
            
            
            // console.log(text)
            
            await worker.terminate()
            return text
            
        },
        Convert(data){
            doc.text(data,35,17).save(`${new Date().getTime()}cisco_Textextractor.pdf`)
        },
        imgToPdf(data){
            // const img = this.$html2canvas(this.$refs.print, {type:'dataURL'})
            // console.log(img)
            // const canvas = document.createElement('canvas')
            // const ctx = canvas.getContext('2d')
            // canvas.width = A4width;
            // canvas.height = A4height;
            // ctx.drawImage('../assets/default.jpg', 0, 0, A4width, A4height)
            // document.body.appendChild(canvas)
             doc.addImage(data,'JPEG',35,17,525,820).save(`${new Date().getTime()}-cisco_pdf.pdf`)
            this.ShowMsg('Information', "Votre fichier a été générer avec success !!", 'success')
        }
    },
}
</script> 
