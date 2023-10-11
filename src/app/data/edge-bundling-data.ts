export class EdgeBundlingData {

    get(): any {
        return {
            "name": "ecommerce",
            "children": [
                {
                    "name": "L1",
                    "children": [],
                    "inbound": ["L3", "L5", "L9"],
                    "outbound": ["L2", "L13", "L10"]
                },
                {
                    "name": "L2",
                    "children": [],
                    "inbound": ["L9"],
                    "outbound": ["L12", "L7"]
                },
                {
                    "name": "L3",
                    "children": [],
                    "inbound": ["L3", "L5", "L9"],
                    "outbound": ["L2", "L13", "L10"]
                },
                {
                    "name": "L4",
                    "children": [],
                    "inbound": ["L3", "L5", "L9"],
                    "outbound": ["L2", "L13", "L10"]
                },
                {
                    "name": "L5",
                    "children": [],
                    "inbound": ["L11", "L1", "L8"],
                    "outbound": ["L14"]
                },
                {
                    "name": "L6",
                    "children": [],
                    "inbound": ["L5", "L8"],
                    "outbound": ["L2", "L13", "L10"]
                },
                {
                    "name": "L7",
                    "children": [],
                    "inbound": ["L9"],
                    "outbound": []
                },
                {
                    "name": "L8",
                    "children": [],
                    "inbound": ["L2", "L1"],
                    "outbound": ["L5", "L4", "L14"]
                },
                {
                    "name": "L9",
                    "children": [],
                    "inbound": ["L11", "L1", "L8"],
                    "outbound": ["L14"]
                },
                {
                    "name": "L10",
                    "children": [],
                    "inbound": ["L12", "L10", "L5"],
                    "outbound": ["L4"]
                },
                {
                    "name": "L11",
                    "children": [],
                    "inbound": ["L3"],
                    "outbound": [ "L6"]
                },
                {
                    "name": "L12",
                    "children": [],
                    "inbound": ["L8"],
                    "outbound": ["L14", "L1", "L11", "L6"]
                },
                {
                    "name": "L13",
                    "children": [],
                    "inbound": ["L10", "L1", "L2"],
                    "outbound": ["L2", "L7"]
                },
                {
                    "name": "L14",
                    "children": [],
                    "inbound": ["L2", "L4", "L8"],
                    "outbound": ["L3"]
                }
            ]
        }
    }
}
