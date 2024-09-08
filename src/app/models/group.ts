import { User } from "./user";

export interface Group {
	id: number;
	name: string;
	image: string;
	mastergroup?: number;
	users: User[];
	subgroups: Group[];
}

export interface InvitationInfos {
	id: number;
	name: string;
	image: string;
}
