import type { Meta, StoryObj } from "@storybook/react-vite";
import { LibraryPreview } from "./library-preview";

const meta = {
  title: "AutoCall/Bibliothèque UI",
  component: LibraryPreview,
} satisfies Meta<typeof LibraryPreview>;

export default meta;

export const Catalogue: StoryObj<typeof meta> = {};
