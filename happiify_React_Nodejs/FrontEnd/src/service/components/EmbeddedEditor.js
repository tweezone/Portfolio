import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';
import apiRoot from '../../config.api';

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

class EmbeddedEditor extends Component {
    
    state={
        editorState: EditorState.createEmpty()
    }

    static propTypes={
        content:  PropTypes.string.isRequired
    };

    onEditorStateChange=(editorState)=>{
        this.setState({ editorState });
        const rawContentState = convertToRaw(editorState.getCurrentContent());
        const content = draftToHtml( rawContentState );
        this.props.getContent(content);
    }

    uploadImageFile=(image)=>new Promise((resolve, reject)=>{
        const formData = new FormData();
        formData.append('image', image);
        axios.post(apiRoot + "editor/add/image", formData, {
            headers:{'Content-Type':'multipart/form-data'}
        })
        .then(res => {
            resolve({ data: { link: apiRoot + 'display/image/file?file=' + res.data}});
        })
        .catch(err=>{
            reject(err);
            console.log("Adding an image in the document error in AddDoc component!");
        });
    });

    componentDidMount(){
        const { content } = this.props;
        const html = content;
        const blocksFromHtml = htmlToDraft(html);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);
        this.setState({ editorState });
    }

   componentDidUpdate(prevProps){
        const { content } = this.props;
        if(content !== prevProps.content){
            if(content==='' || prevProps.content === ''){
                const html = content;
                const blocksFromHtml = htmlToDraft(html);
                const { contentBlocks, entityMap } = blocksFromHtml;
                const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                const editorState = EditorState.createWithContent(contentState);
                this.setState({ editorState });
            }
        }
    }

    render(){
        const { editorState } = this.state;

        let toolbarHidden = '';
        let onEditorStateChange=this.onEditorStateChange;
        if(this.props.toolbarHidden !== undefined){
            this.props.toolbarHidden? toolbarHidden = 'true': toolbarHidden='';
            this.props.toolbarHidden? onEditorStateChange='' : onEditorStateChange=this.onEditorStateChange;
        }
        return(
                <Editor
                    editorState={editorState}
                    toolbarHidden = {toolbarHidden}
                    toolbar={{
                        image: { uploadCallback: this.uploadImageFile }
                    }}
                    toolbarStyle={{border:'1px solid #ced4da', borderRadius:'0.25rem'}}
                    editorStyle={{height:'300px', border:'1px solid #ced4da', padding:'5px', borderRadius:'0.25rem', background: 'white'}}
                    onEditorStateChange={onEditorStateChange}
                />
        );
    }
}

export default EmbeddedEditor;