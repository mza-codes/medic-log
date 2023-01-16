import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { hooker, RTFTemplate } from '../../Assets';
import useApiService from '../../Services/APIService';
import useLocalState from '../../Services/LocalState';
import { useState } from 'react';

const RTF = ({ record }) => {
    console.count("RTF rendered");
    const setDocument = hooker("setDocument", useApiService);
    const personData = useLocalState(s => s.personData);
    const setPersonData = useLocalState(s => s.setPersonData);
    const [data, setData] = useState(RTFTemplate);

    const handleConfirm = () => {
        setDocument(personData + data);
        return true;
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph', 'list'] }),
        ],
        onUpdate({ editor }) {
            setData(editor.getHTML());
            return true;
        },
        parseHTML() {
            return [{
                tag: 'node-view',
            }]
        },
        content: record ?? data
    });

    const clearDocs = () => {
        const myDoc = document.querySelector('.ProseMirror');
        myDoc.innerHTML = "<p>Cleared!</p>";
        setData("");
        setPersonData(" ");
        setDocument(" ");
        return;
    };

    return (

        <RichTextEditor editor={editor} className="lg:max-w-[800px] relative rtfEditor">
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                    <RichTextEditor.Code />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                    <RichTextEditor.Subscript />
                    <RichTextEditor.Superscript />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
            <button type='button' onClick={handleConfirm} title="Confirm Document Changes"
                className='bg-teal-400 my-2 hover:bg-teal-500 p-2 absolute -top-14 right-0
                disabled:bg-gray-400 disabled:hover:bg-gray-400 rounded-md'>
                Confirm
            </button>
            <button type='button' onClick={clearDocs} title="Clear Patient Document"
                className=' my-2 p-2 absolute -top-14 left-0 hover:text-[red] hover:scale-105
                disabled:bg-gray-400 disabled:hover:bg-gray-400 rounded-md'>
                <iconify-icon icon="ic:round-delete-sweep" width="auto" height="auto" />
            </button>
        </RichTextEditor>
    );
};

export default RTF; 