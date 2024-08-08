import { useState, useEffect, useCallback } from "react";
import Tree from "react-d3-tree";
import { TreeNodeEventCallback } from "react-d3-tree";
import '../styles/tree.css';

interface RawNodeDatum {
  name: string;
  attributes?: Record<string, string | number | boolean>;
  children?: RawNodeDatum[];
}

interface CustomNodeDatum extends RawNodeDatum {
    id?: number;
    children_ids?: number[];
    children?: CustomNodeDatum[];
}

type TreeNode = {
  email: string;
  name: string;
  id: number;
  position: string;
  hiring_date: string;
  subordinate_ids: number[];
};

type TreeRoot = {
  email: string;
  name: string;
  id: number;
  position: string;
  hiring_date: string;
  subordinate: TreeNode[];
};

const InitialState: RawNodeDatum = {
  name: "Origin",
  children: []
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findNodeById(obj: any, id: number) {
  console.log(obj)
  if (obj.id === id) return obj;

  for (const child of obj.children) {
      const res = findNodeById(child, id);
      if (res) return res;
  }

  return null;
}

function appendRoot(root: TreeRoot[]) {
  const tree: CustomNodeDatum = {
    name: "Origin",
    children: [],
  }

  for (const node of root) {
    const name = node.name;
    const childrens = [];
    for (const childNode of node.subordinate) {
      childrens.push({
        id: childNode.id,
        name: childNode.name,
        attributes: {
          position: childNode.position
        },
        children: [],
        children_ids: childNode.subordinate_ids
      });
    }

    tree.children?.push({
      id: node.id,
      name,
      attributes: {
        position: node.position
      },
      children: childrens,
    });
  }

  return tree;
}

function prepareChildren(node: TreeNode) {
  return {
    id: node.id,
    name: node.name,
    attributes: {
      position: node.position
    },
    children: [],
    children_ids: node.subordinate_ids
  }
}

function TreeComponent() {
  const [treeData, setTreeData] = useState(InitialState);

  // Функція для завантаження початкових даних дерева
  useEffect(() => {
    const fetchInitialTree = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/employees-tree"
        );
        const data: TreeRoot[] = await response.json();
        const newTree = appendRoot(data);
        setTreeData(newTree);
      } catch (error) {
        console.error("Error fetching initial tree:", error);
      }
    };

    fetchInitialTree();
  }, []);

    const handleNodeClick: TreeNodeEventCallback = useCallback(async (nodeData, event) => {
      if (nodeData.data.children?.length) return; // Якщо у вузла вже є діти, нічого не робимо
      console.log(nodeData, 'click');

      const ids = nodeData.data.children_ids?.join(',');
      console.log(nodeData, nodeData.data.id)
      console.log(treeData, 'treeData');
      const node = findNodeById(treeData, nodeData.data.id)
      console.log(node, 'findNodeById')

      try {
        console.log('fetch')
        const response = await fetch(`http://localhost:8000/api/employees-tree/node/?ids=${ids}`);
        const treeNodes: TreeNode[] = await response.json();
        const childrens = treeNodes.map(prepareChildren);

        console.log(node)
        node.children = [...node.children, ...childrens];
        setTreeData(structuredClone(treeData));
      } catch (error) {
        console.error("Error fetching child nodes:", error);
      }
    }, [treeData]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Tree
        data={treeData}
        onNodeClick={(nodeData, event) => handleNodeClick(nodeData, event)}
        orientation="vertical"
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
      />
    </div>
  );
};

export default TreeComponent;
