/* eslint-disable no-undef */
import { useEffect, useState } from 'react';

import Quill from 'quill';
import 'quill/dist/quill.snow.css';

import { Box } from '@mui/material';
import styled from '@emotion/styled';

import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { saveAs } from 'file-saver';
import { pdfExporter } from 'quill-to-pdf';
// import * as quill from 'quilljs';

const Component = styled.div`
background : #F5F5F5
`



{
    // specify the fonts you would 
    var fonts = ['Arial', 'Courier', 'Garamond', 'Tahoma', 'Times New Roman', 'Verdana', 'Impact', 'Futura', 'Bodoni'];
    // generate code friendly names
    function getFontName(font) {
        return font.toLowerCase().replace(/\s/g, "-");
    }
    var fontNames = fonts.map(font => getFontName(font));
    // add fonts to style
    var fontStyles = "";
    fonts.forEach(function (font) {
        var fontName = getFontName(font);
        fontStyles += ".ql-snow .ql-picker.ql-font .ql-picker-label[data-value=" + fontName + "]::before, .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=" + fontName + "]::before {" +
            "content: '" + font + "';" +
            "font-family: '" + font + "', sans-serif;" +
            "}" +
            ".ql-font-" + fontName + "{" +
            " font-family: '" + font + "', sans-serif;" +
            "}";
    });
    var node = document.createElement('style');
    node.innerHTML = fontStyles;
    document.body.appendChild(node);
}


const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }, 'image', 'video', 'link'],          // dropdown with defaults from theme
    [{ 'font': fontNames }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];


let quillServer;
const Editor = () => {

    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    const { id } = useParams();

    useEffect(() => {
        quillServer = new Quill('#container', { theme: 'snow', modules: { toolbar: toolbarOptions } })
        quillServer.disable();
        quillServer.setText("Loading the document...")
        setQuill(quillServer);
    }, []);



    useEffect(() => {
        const socketServer = io('http://localhost:9000');
        setSocket(socketServer);

        return () => {
            socketServer.disconnect();
        }
    }, []);

    useEffect(() => {
        if (socket === null || quill === null) return;

        const handleChange = (delta, oldData, source) => {
            if (source !== 'user') return;

            socket && socket.emit('send-changes', delta);
        }

        quill && quill.on('text-change', handleChange);

        return () => {
            quill && quill.off('text-change', handleChange);
        }
    }, [quill, socket]);

    useEffect(() => {
        if (socket === null || quill === null) return;

        const handleChange = (delta) => {
            quill.updateContents(delta);
        }

        socket && socket.on('receive-changes', handleChange);

        return () => {
            socket && socket.off('receive-changes', handleChange);
        }
    }, [quill, socket]);

    useEffect(() => {
        if (quill === null || socket === null) return;

        socket && socket.once('load-document', document => {
            quill && quill.setContents(document);
            quill.enable();
        })

        socket && socket.emit('get-document', id);
    }, [quill, socket, id]);

    useEffect(() => {
        if (socket === null || quill === null) return;

        const interval = setInterval(() => {
            socket && socket.emit('save-document', quill.getContents())
        }, 2000);

        return () => {
            clearInterval(interval);
        }
    }, [socket, quill]);


    return (
        <Component>
            <Box className='container' id='container'></Box>
            <Stack direction="row" spacing={2}>
                {/* // eslint-disable-next-line no-undef */}
                <Button onClick={exportPdf} className='pdfbtn' id='pdfbtn'>PDF</Button>
                <Button onClick={exportWord} className='wordbtn' id='wordbtn'>Word</Button>

                {/* <Button disabled>Disabled</Button> */}
                {/* <Button href="#text-buttons">Link</Button> */}
            </Stack>        
        </Component>
    )

    async function exportPdf(){
        // alert("Hello")
        const del = quillServer.getContents(); // gets the Quill delta
        const pdfAsBlob = await pdfExporter.generatePdf(del); // converts to PDF
        saveAs(pdfAsBlob, 'pdf-export.pdf'); // downloads from the browser
    }
    async function exportWord(){
        
    }
}

export default Editor;