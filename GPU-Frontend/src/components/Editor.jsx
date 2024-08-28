import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor as REditor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useEffect, useState } from 'react';
import '../styles/index.css'

export default function MyEditor({ handleSubmit, htmlContent, title = "Save Heading" }) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [text, setText] = useState('');

    useEffect(() => {
        const fetchContent = () => {
            try {
                const contentBlock = htmlToDraft(htmlContent);
                if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks, contentBlock.entityMap);
                    const editorState = EditorState.createWithContent(contentState);
                    setEditorState(editorState);
                }
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };

        if (htmlContent && htmlContent !== '') {
            fetchContent();
        }

    }, [htmlContent]);

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
        const rawContentState = convertToRaw(editorState.getCurrentContent());
        const htmlContent = draftToHtml(rawContentState, {
            defaultBlockTag: 'div',
            preserveWhitespace: true,
        });
        setText(htmlContent);
    };

    const saveContentToBackend = async () => {
        if (text !== '' && text) {
            handleSubmit(text)
        }
    };


    return (
        <>
            <REditor
                editorState={editorState}
                toolbar={{
                    options: ['inline', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link'],
                }}
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                toolbarClassName="toolbarClassName"
                onEditorStateChange={onEditorStateChange}
            />
            <button
                onClick={saveContentToBackend}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
            >
                {title}
            </button>

        </>
    );
}
