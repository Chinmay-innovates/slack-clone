interface WorkspaceIdPageProps {
	params: {
		Id: string;
	};
}
const WorkspaceIdPage = ({ params }: WorkspaceIdPageProps) => {
	return (
		<div>
			<h1>Workspace ID: {params.Id}</h1>
		</div>
	);
};

export default WorkspaceIdPage;
