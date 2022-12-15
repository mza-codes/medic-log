import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { docAtom } from '../../App';
import { useAtom } from 'jotai';
import styled from 'styled-components';
import parse from 'html-react-parser';
import { hooker } from '../../Assets';
import useApiService from '../../Services/APIService';
import { RTFDoc } from '../RTF';

const RTFViewWrapper = styled.div`
    width: inherit;
    max-width: inherit;
`;

const RTF = () => {
    console.count("RTF rendered");
    const [data, setData] = useAtom(docAtom);
    const setDocument = hooker("setDocument", useApiService);

    const handleChange = (html, json) => {
        console.log(html);
        setData(html);
        return true;
    };

    const handleConfirm = () => {
        console.log("HANDLING CONFIRM", data.length); // 136
        setDocument(data);
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
            handleChange(editor.getHTML(), editor.getJSON());
        },
        parseHTML() {
            return [{
                tag: 'node-view',
            }]
        },
        content: data
    });

    return (
        <>
            <RichTextEditor editor={editor} className="lg:max-w-[800px] relative rtfEditor" >
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
                <button type='button' onClick={handleConfirm}
                    className='bg-teal-400 my-2 hover:bg-teal-500 p-2 absolute -top-14 right-0'>
                    Confirm
                </button>
            </RichTextEditor>

            <RTFViewWrapper>
                <h1 className="text-3xl my-4 text-center">View Patient Log</h1>
                <RTFDoc>
                    {parse(data)}
                </RTFDoc>
            </RTFViewWrapper>


        </>
    );
};

export default RTF; 