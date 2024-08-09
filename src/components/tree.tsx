/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import Tree, { Point } from 'react-d3-tree';
import { TreeNodeEventCallback } from 'react-d3-tree';
import { useCenteredTree } from '../utils/helpers';
import '../styles/tree.css';

interface RawNodeDatum {
  name: string;
  attributes?: Record<string, string | number | boolean>;
  children?: RawNodeDatum[];
}

interface CustomNodeDatum extends RawNodeDatum {
  id?: number;
  subordinate_ids?: number[];
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
  name: 'Organization',
  children: [],
};

function findNodeById(obj: any, id: number): any {
  if (obj.id === id) return obj;

  for (const child of obj.children) {
    const res = findNodeById(child, id);
    if (res) return res;
  }

  return null;
}

function appendRoot(root: TreeRoot[]) {
  const tree: CustomNodeDatum = {
    name: 'Organization',
    children: [],
    id: 0,
  };

  for (const node of root) {
    const name = node.name;
    const childrens = [];
    for (const childNode of node.subordinate) {
      childrens.push({
        id: childNode.id,
        name: childNode.name,
        attributes: {
          position: childNode.position,
        },
        children: [],
        subordinate_ids: childNode.subordinate_ids,
      });
    }

    tree.children?.push({
      id: node.id,
      name,
      attributes: {
        position: node.position,
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
      position: node.position,
    },
    children: [],
    subordinate_ids: node.subordinate_ids,
  };
}

function TreeComponent() {
  const [translate, containerRef] = useCenteredTree();
  const [treeData, setTreeData] = useState(InitialState);

  useEffect(() => {
    const fetchInitialTree = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/api/employees-tree'
        );
        const data: TreeRoot[] = await response.json();
        const newTree = appendRoot(data);
        setTreeData(newTree);
      } catch (error) {
        console.error('Error fetching initial tree:', error);
      }
    };

    fetchInitialTree();
  }, []);

  const handleNodeClick: TreeNodeEventCallback = useCallback(
    async (nodeData) => {
      const data: CustomNodeDatum = nodeData.data;
      if (data.children?.length) return;

      const ids = data.subordinate_ids?.join(',');

      if (!data.id) return;

      const node = findNodeById(treeData, data.id);

      try {
        const response = await fetch(
          `http://localhost:8000/api/employees-tree/node/?ids=${ids}`
        );
        const treeNodes: TreeNode[] = await response.json();
        const childrens = treeNodes.map(prepareChildren);

        node.children = [...node.children, ...childrens];
        setTreeData(structuredClone(treeData));
      } catch (error) {
        console.error('Error fetching child nodes:', error);
      }
    },
    [treeData]
  );

  return (
    <div
      style={{ width: '100vw', height: '100vh' }}
      ref={containerRef as (containerElem: any) => void}
    >
      <Tree
        data={treeData}
        translate={translate as Point}
        zoom={0.8}
        onNodeClick={(nodeData, event) => handleNodeClick(nodeData, event)}
        orientation="vertical"
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
      />
    </div>
  );
}

export default TreeComponent;
