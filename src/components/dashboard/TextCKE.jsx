import { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import {
    ClassicEditor,
    AccessibilityHelp,
    AutoLink,
    Autosave,
    Bold,
    Code,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Highlight,
    HorizontalLine,
    Italic,
    Link,
    Paragraph,
    RemoveFormat,
    SelectAll,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Subscript,
    Superscript,
    Underline,
    Undo
} from 'ckeditor5';

import translations from 'ckeditor5/translations/vi.js';

import 'ckeditor5/ckeditor5.css';
import '../../App.css';
const TextCKE = ({ initText, onChangeValue }) => {

    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    // 
    const [value, setValue] = useState('')
    useEffect(() => {
        setIsLayoutReady(true);
        setValue(initText)
        return () => setIsLayoutReady(false);
    }, []);

    useEffect(() => {
        onChangeValue(value)
        // console.log(value)
    }, [value]);

    const editorConfig = {
        toolbar: {
            items: [
                'undo',
                'redo',
                '|',
                'selectAll',
                '|',
                'fontSize',
                'fontFamily',
                'fontColor',
                'fontBackgroundColor',
                '|',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'subscript',
                'superscript',
                'code',
                'removeFormat',
                '|',
                'specialCharacters',
                'horizontalLine',
                'link',
                'highlight',
                '|',
                'accessibilityHelp'
            ],
            shouldNotGroupWhenFull: false
        },
        plugins: [
            AccessibilityHelp,
            AutoLink,
            Autosave,
            Bold,
            Code,
            Essentials,
            FontBackgroundColor,
            FontColor,
            FontFamily,
            FontSize,
            Highlight,
            HorizontalLine,
            Italic,
            Link,
            Paragraph,
            RemoveFormat,
            SelectAll,
            SpecialCharacters,
            SpecialCharactersArrows,
            SpecialCharactersCurrency,
            SpecialCharactersEssentials,
            SpecialCharactersLatin,
            SpecialCharactersMathematical,
            SpecialCharactersText,
            Strikethrough,
            Subscript,
            Superscript,
            Underline,
            Undo
        ],
        fontFamily: {
            supportAllValues: true
        },
        fontSize: {
            options: [10, 12, 14, 'default', 18, 20, 22],
            supportAllValues: true
        },
        // fontColor: {
        //     colors: [
        //       {
        //         color: 'hsl(0, 0%, 0%)',
        //         label: 'Black'
        //       }
        //     ],
        //     columns: 5,
        //     documentColors: 10
        // },
        initialData: initText,
        language: 'vi',
        link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        placeholder: 'Type or paste your content here!',
        translations: [translations]
    };

    return (
        <div>
            <div className="main-container hover:shadow-lg">
                <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
                    <div className="editor-container__editor">
                        <div ref={editorRef}>
                            {isLayoutReady && <CKEditor editor={ClassicEditor} config={editorConfig}
                                onChange={(event, editor) => {
                                    const datanew = editor.getData();
                                    setValue(datanew)
                                    console.log('data:',value )
                                }}
                            />}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default TextCKE