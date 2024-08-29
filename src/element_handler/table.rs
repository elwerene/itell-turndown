use crate::{node_util::get_parent_node, Element};
use markup5ever_rcdom::{Node, NodeData};
use std::cell::Ref;
use std::collections::HashMap;
use std::rc::Rc;

pub(super) fn table_cell_handler(element: Element) -> Option<String> {
    let content = element.content;
    cell(content, element.node)
}

// rules.tableRow = {
//   filter: 'tr',
//   replacement: function (content, node) {
//     var borderCells = ''
//     var alignMap = { left: ':--', right: '--:', center: ':-:' }

//     if (isHeadingRow(node)) {
//       for (var i = 0; i < node.childNodes.length; i++) {
//         var border = '---'
//         var align = (
//           node.childNodes[i].getAttribute('align') || ''
//         ).toLowerCase()

//         if (align) border = alignMap[align] || border

//         borderCells += cell(border, node.childNodes[i])
//       }
//     }
//     return '\n' + content + (borderCells ? '\n' + borderCells : '')
//   }
// }
pub(super) fn table_row_handler(element: Element) -> Option<String> {
    let children = element.node.children.borrow();
    let mut border_cells = String::new();
    if is_heading_row(&element) {
        for child in children.iter() {
            if let NodeData::Element {
                ref name,
                ref attrs,
                ..
            } = child.data
            {
                if &name.local == "th" {
                    let align = attrs
                        .borrow()
                        .iter()
                        .find(|attr| &attr.name.local == "align")
                        .map(|attr| attr.value.to_string())
                        .unwrap_or_default()
                        .to_lowercase();
                    let align_map =
                        HashMap::from([("left", ":--"), ("right", "--:"), ("center", ":-:")]);
                    let border = align_map
                        .get(&align as &str)
                        .cloned()
                        .or(Some(&"---"))
                        .unwrap();
                    border_cells.push_str(cell(border, child).unwrap().as_str());
                }
            }
        }
        if !border_cells.is_empty() {
            border_cells.insert_str(0,"\n");
        }
    }
    return Some(format!("\n{}{}", element.content, border_cells));
}

// rules.table = {
//   // Only convert tables with a heading row.
//   // Tables with no heading row are kept using `keep` (see below).
//   filter: function (node) {
//     return node.nodeName === 'TABLE' && isHeadingRow(node.rows[0])
//   },

//   replacement: function (content) {
//     // Ensure there are no blank lines
//     content = content.replace('\n\n', '\n')
//     return '\n\n' + content + '\n\n'
//   }
// }
pub(super) fn table_handler(element: Element) -> Option<String> {
    if is_heading_row(&element) {
        let mut content = element.content.to_string();
        content = content.replace("\n\n", "\n");
        return Some(format!("\n\n{}{}\n\n", content, element.content));
    } else {
        return Some(element.content.to_string());
    }
    // let children: Ref<'_, Vec<Rc<Node>>> = element.node.children.borrow();
    // let first_td = children.iter().find(|&element| {
    //     if let NodeData::Element { ref name, .. } = element.data {
    //         &name.local == "td"
    //     } else {
    //         false
    //     }
    // });
    // if first_td.is_none() {
    //     return Some(element.content.to_string());
    // } else if Rc::ptr_eq(first_td.unwrap(), element.node) {
    //     // First item in row
    //     Some(format!("| {} |", element.content))
    // } else {
    //     // Not the first item in row
    //     Some(format!(" {} |", element.content))
    // }
}

// rules.tableSection = {
//   filter: ['thead', 'tbody', 'tfoot'],
//   replacement: function (content) {
//     return content
//   }
// }
pub(super) fn table_section_handler(element: Element) -> Option<String> {
    Some(element.content.to_string())
}

// A tr is a heading row if:
// - the parent is a THEAD
// - or if its the first child of the TABLE or the first TBODY (possibly
//   following a blank THEAD)
// - and every cell is a TH
// function isHeadingRow (tr) {
//   var parentNode = tr.parentNode
//   return (
//     parentNode.nodeName === 'THEAD' ||
//     (
//       parentNode.firstChild === tr &&
//       (parentNode.nodeName === 'TABLE' || isFirstTbody(parentNode)) &&
//       every.call(tr.childNodes, function (n) { return n.nodeName === 'TH' })
//     )
//   )
// }
pub(super) fn is_heading_row(element: &Element) -> bool {
    let parent_node = get_parent_node(element.node).unwrap();
    let children = parent_node.children.borrow();
    if let NodeData::Element { ref name, .. } = parent_node.data {
        if &name.local == "thead" {
            return true;
        } else if Rc::ptr_eq(children.first().unwrap(), element.node) {
            if let NodeData::Element { ref name, .. } = parent_node.data {
                if &name.local == "table" {
                    return true;
                } else if is_first_tbody(&parent_node) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

// function isFirstTbody (element) {
//   var previousSibling = element.previousSibling
//   return (
//     element.nodeName === 'TBODY' && (
//       !previousSibling ||
//       (
//         previousSibling.nodeName === 'THEAD' &&
//         /^\s*$/i.test(previousSibling.textContent)
//       )
//     )
//   )
// }
fn is_first_tbody<'a>(node: &'a Rc<Node>) -> bool {
    let parent_node = get_parent_node(node).unwrap();
    let children = parent_node.children.borrow();
    let previous_sibling = children
        .iter()
        .position(|child| Rc::ptr_eq(child, node))
        .map(|index| children.get(index - 1))
        .unwrap_or(None);

    let previous_sibling_has_text = previous_sibling
        .map(|node| {
            if let NodeData::Text { ref contents, .. } = node.data {
                contents.borrow().to_string().trim().is_empty()
            } else {
                false
            }
        })
        .unwrap();

    if let NodeData::Element { ref name, .. } = node.data {
        if &name.local != "tbody" {
            return false;
        } else if previous_sibling.is_none() {
            return true;
        } else if let NodeData::Element { ref name, .. } = previous_sibling.unwrap().data {
            if &name.local == "thead" && previous_sibling_has_text {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

fn cell(content: &str, node: &Rc<Node>) -> Option<String> {
    let parent_node = get_parent_node(node).unwrap();
    // check if first item in row equals current element
    let valid_child_names = vec!["th", "td"];
    let children = parent_node.children.borrow();
    let first_td = get_first_child(&children, &valid_child_names).unwrap();

    if Rc::ptr_eq(first_td, &node) {
        // First item in row
        Some(format!("| {} |", content))
    } else {
        // Not the first item in row
        Some(format!(" {} |", content))
    }
}

fn get_first_child<'a>(
    children: &'a Ref<Vec<Rc<Node>>>,
    valid_names: &'a Vec<&str>,
) -> Option<&'a Rc<Node>> {
    children.iter().find(|&element| {
        if let NodeData::Element { ref name, .. } = element.data {
            valid_names.contains(&name.local.to_string().as_str())
        } else {
            false
        }
    })
}
