import { DirectoryState, NodeType } from '@/store/documents.store';
import Document from './Document';
import Folder from './Folder';
import CreateNode from './CreateNode';

interface Props {
  data: DirectoryState;
  path: string;
  isCreatingNode: NodeType | null;
  onNodeCreated: () => void;
  depth?: number;
}

export default function Directory(props: Props) {
  const { data, path, isCreatingNode, onNodeCreated, depth = 0 } = props;

  return (
    <>
      {isCreatingNode && (
        <CreateNode
          path={path}
          node={isCreatingNode}
          onNodeCreated={onNodeCreated}
          depth={depth}
        />
      )}
      {Object.keys(data)
        .sort((a, b) => {
          return data[a].type.localeCompare(data[b].type) * -1 || a.localeCompare(b);
        })
        .map((name) => {
          const nodeData = data[name];

          return nodeData.type === 'document' ? (
            <Document key={name} path={path} name={name} depth={depth} />
          ) : (
            <Folder
              key={name}
              path={path}
              name={name}
              directory={nodeData.directory}
              depth={depth}
            />
          );
        })}
    </>
  );
}
