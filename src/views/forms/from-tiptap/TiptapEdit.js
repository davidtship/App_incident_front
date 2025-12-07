// src/views/forms/from-tiptap/TiptapEdit.jsx
import React, { useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  RichTextEditorProvider,
  RichTextField,
  MenuControlsContainer,
  MenuButtonBold,
  MenuButtonItalic,
  MenuButtonStrikethrough,
  MenuSelectHeading,
  MenuDivider,
  MenuButtonOrderedList,
  MenuButtonBulletedList,
  MenuButtonBlockquote,
  MenuButtonCode,
  MenuButtonHorizontalRule,
  MenuButtonUndo,
  MenuButtonRedo,
  MenuButtonRemoveFormatting,
} from "mui-tiptap";
import { Box } from "@mui/material";
import './Tiptap.css';

const TiptapEdit = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "<p>Saisissez ici...</p>",
    onUpdate({ editor }) {
      // ⚡ Toujours renvoyer le HTML
      onChange(editor.getHTML());
    },
  });

  // Si la valeur externe change, mettre à jour l'éditeur
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p>Saisissez ici...</p>");
    }
  }, [value, editor]);

  return (
    <Box sx={{ border: "1px solid #ccc", borderRadius: 1, minHeight: 150, p: 1 }}>
      <RichTextEditorProvider editor={editor}>
        <RichTextField
          controls={
            <MenuControlsContainer>
              <MenuSelectHeading />
              <MenuDivider />
              <MenuButtonBold />
              <MenuButtonItalic />
              <MenuButtonStrikethrough />
              <MenuDivider />
              <MenuButtonOrderedList />
              <MenuButtonBulletedList />
              <MenuDivider />
              <MenuButtonBlockquote />
              <MenuButtonCode />
              <MenuButtonHorizontalRule />
              <MenuDivider />
              <MenuButtonUndo />
              <MenuButtonRedo />
              <MenuDivider />
              <MenuButtonRemoveFormatting />
            </MenuControlsContainer>
          }
        />
      </RichTextEditorProvider>
    </Box>
  );
};

export default TiptapEdit;
