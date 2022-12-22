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
import { hooker } from '../../Assets';
import useApiService from '../../Services/APIService';

const RTF = ({ record }) => {
    console.count("RTF rendered");
    const [data, setData] = useAtom(docAtom);
    const setDocument = hooker("setDocument", useApiService);
    const document = useApiService(s => s.data.document);
    const updated = document === data.doc;

    const handleConfirm = () => {
        console.log("HANDLING CONFIRM", data.length); // 136
        setDocument(data.doc);
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
            setData((curr) => ({ ...curr, doc: editor.getHTML() }));
            return true;
            // handleChange(editor.getHTML(), editor.getJSON());
        },
        parseHTML() {
            return [{
                tag: 'node-view',
            }]
        },
        content: record ?? data.doc
    });

    return (

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
            <button type='button' onClick={handleConfirm} disabled={updated}
                className='bg-teal-400 my-2 hover:bg-teal-500 p-2 absolute -top-14 right-0
                disabled:bg-gray-400 disabled:hover:bg-gray-400 rounded-md'>
                Confirm
            </button>
        </RichTextEditor>
    );
};

export default RTF; 