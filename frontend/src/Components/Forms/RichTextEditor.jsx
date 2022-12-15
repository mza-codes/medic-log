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

const RTFViewWrapper = styled.div`
    width: inherit;
    max-width: inherit;
`;
// 249ea0,008083,005f60
const RTFDoc = styled.section`
    /* background: linear-gradient(to right, #8ccbcc,#40adaf); */
    background-color: #d9f1f1;
    color:#000;
    padding: 0.5rem;
    max-width: 100vw;
    border-radius: 4px;
    min-width: 90vw;
    
    h1 {
        font-size: 4.0rem;
        font-weight: bolder;
    }
    h2 {
        font-size: 3.5rem;
        font-weight: bolder;
    }
    h3 {
        font-size: 3.0rem;
        font-weight: bolder;
    }
    h4 {
        font-size: 2.5rem;
        font-weight: bolder;
    }
    h5 {
        font-size: 2.0rem;
        font-weight: bolder;
    }
    h6 {
        font-size: 1.5rem;
        font-weight: bolder;
    }
    ul{
        list-style: disc;
    }
`

const RTF = (props) => {
    console.count("RTF rendered");
    const [data, setData] = useAtom(docAtom);

    const handleChange = (html, json) => {
        console.log("handling changer rtf editor", data);
        console.log(html);
        setData(html);
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
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
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
            <RichTextEditor editor={editor} {...props} editable={false}>
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
            </RichTextEditor>

            <RTFViewWrapper>
                <h1 className="text-4xl my-2 text-center">View Patient Log</h1>
                <RTFDoc className="">
                    {parse(data)}
                </RTFDoc>
            </RTFViewWrapper>
        </>
    );
};

export default RTF; 