use crate::{node_util::get_parent_node, Element};
use markup5ever_rcdom::{Node, NodeData};
// use std::cell::{Ref, RefCell};
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
pub(super) fn table_row_handler(row: Element) -> Option<String> {
    let children = row.node.children.borrow();
    let mut border_cells = String::new();

    let row_has_text = get_text_content(row.node)
        .iter()
        .any(|text| !text.trim().is_empty());

    if !row_has_text {
        return Some(String::new());
    }

    if is_heading_row(row.node) {
        for child in children.iter() {
            if let NodeData::Element {
                ref attrs,
                ..
            } = child.data
            {
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
        if !border_cells.is_empty() {
            border_cells.insert_str(0, "\n");
        }
    }
    return Some(format!("\n{}{}", row.content, border_cells));
}

pub(super) fn table_handler(element: Element) -> Option<String> {
    let table_rows = get_table_rows(element.node);

    let first_row = table_rows.first();
    if first_row.is_none() || !is_heading_row(first_row.unwrap()) {
        return Some(element.content.to_string());
    } else {
        let mut content = element.content.to_string();
        content = content.replace("\n\n", "\n");
        return Some(format!("\n\n{}\n\n", content));
    }
}

pub(super) fn table_section_handler(element: Element) -> Option<String> {
    Some(element.content.to_string())
}

// A tr is a heading row if:
// - the parent is a THEAD
// - or if its the first child of the TABLE or the first TBODY (possibly
//   following a blank THEAD)
// - and every cell is a TH
pub(super) fn is_heading_row(tr: &Rc<Node>) -> bool {
    let parent_node = get_parent_node(&tr).unwrap();
    let siblings = get_child_elements(&parent_node);
    let children = get_child_elements(tr);
    let parent_name = if let NodeData::Element { ref name, .. } = parent_node.data {
        name.local.to_string()
    } else {
        "".to_string()
    };
    let first_sibling_is_tr = siblings
        .first()
        .map(|child| Rc::ptr_eq(child, tr))
        .unwrap_or(false);
    let is_first_tbody = is_first_tbody(&parent_node);
    let every_cell_is_th = children.iter().all(|child| {
        if let NodeData::Element { ref name, .. } = child.data {
            &name.local == "th"
        } else {
            false
        }
    });
    if parent_name == "thead" {
        return true;
    } else if first_sibling_is_tr && (parent_name == "table" || is_first_tbody) && every_cell_is_th
    {
        return true;
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
fn is_first_tbody(node: &Rc<Node>) -> bool {
    let parent_node = get_parent_node(node).unwrap();
    let siblings = get_child_elements(&parent_node);

    let is_tbody = if let NodeData::Element { ref name, .. } = node.data {
        &name.local == "tbody"
    } else {
        false
    };

    let previous_sibling = siblings
        .iter()
        .position(|child| Rc::ptr_eq(child, node))
        .map(|index: usize| siblings.get(index - 1))
        .unwrap();

    if !is_tbody {
        return false;
    } else if previous_sibling.is_none() {
        return true;
    } else {
        let previous_sibling_is_thead =
            if let NodeData::Element { ref name, .. } = previous_sibling.unwrap().data {
                &name.local == "thead"
            } else {
                false
            };

        let previous_sibling_has_text = get_text_content(previous_sibling.unwrap())
            .iter()
            .any(|text| !text.trim().is_empty());

        if previous_sibling_is_thead && !previous_sibling_has_text {
            return true;
        } else {
            return false;
        }
    }
}

fn cell(content: &str, node: &Rc<Node>) -> Option<String> {
    let parent_node = get_parent_node(node).unwrap();
    let children = parent_node.children.borrow();
    // check if first item in row equals current element
    let first_child_index: Option<usize> = get_first_child_index(node);

    match first_child_index {
        Some(index) => {
            let first_td = children.get(index).unwrap();
            if Rc::ptr_eq(first_td, node) {
                // First item in row
                Some(format!("| {} |", content))
            } else {
                // Not the first item in row
                Some(format!(" {} |", content))
            }
        }
        None => Some(format!("| {} |", content)),
    }
}

fn is_element(node: &Rc<Node>) -> bool {
    match &node.data {
        // NodeData::Text { ref contents } => contents.borrow().to_string().trim().is_empty(),
        NodeData::Element { .. } => true,
        _ => false,
    }
}

fn get_child_elements(node: &Rc<Node>) -> Vec<Rc<Node>> {
    let children = node.children.borrow();
    children
        .iter()
        .filter(|child| is_element(child))
        .cloned()
        .collect()
}

fn get_first_child_index(node: &Rc<Node>) -> Option<usize> {
    let parent = get_parent_node(&node).unwrap();
    let children = parent.children.borrow();
    children.iter().position(|element| is_element(element))
}

fn get_table_rows(node: &Rc<Node>) -> Vec<Rc<Node>> {
    let mut rows = Vec::new();
    collect_tr_elements(node, &mut rows);
    rows
}

fn collect_tr_elements(node: &Rc<Node>, rows: &mut Vec<Rc<Node>>) {
    let children = node.children.borrow();
    for child in children.iter() {
        if let NodeData::Element { ref name, .. } = child.data {
            if &name.local == "tr" {
                rows.push(child.clone());
            } else {
                // Recursively search in child nodes
                collect_tr_elements(child, rows);
            }
        }
    }
}

fn get_text_content(node: &Rc<Node>) -> Vec<String> {
    let mut text_content = Vec::new();
    collect_text_content(node, &mut text_content);
    text_content
}

fn collect_text_content(node: &Rc<Node>, text_content: &mut Vec<String>) {
    let children = node.children.borrow();
    for child in children.iter() {
        if let NodeData::Text { ref contents } = child.data {
            text_content.push(contents.borrow().to_string());
        } else {
            // Recursively search in child nodes
            collect_text_content(child, text_content);
        }
    }
}
