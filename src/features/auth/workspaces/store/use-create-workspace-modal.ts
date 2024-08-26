import { atom, Atom, useAtom } from "jotai";

const modalState = atom(false);

export const useCreateWorkspaceModal = () => {
	return useAtom(modalState);
};
