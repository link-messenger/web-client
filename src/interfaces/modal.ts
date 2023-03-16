
export interface ModalCardProps {
	currentId: string;
	closeModal: (id: string) => void;
}


// TODO: ts bug fix later 
export interface FunctionalModalCardProps extends ModalCardProps {
	onClick?: any;
}