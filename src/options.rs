/// The HTML to Markdown converting options.
#[derive(Debug)]
pub struct Options {
    pub heading_style: HeadingStyle,
    pub hr_style: HrStyle,
    pub br_style: BrStyle,
    pub link_style: LinkStyle,
    pub link_reference_style: LinkReferenceStyle,
    pub code_block_style: CodeBlockStyle,
    pub code_block_fence: CodeBlockFence,
    pub bullet_list_marker: BulletListMarker,
    /// If true, the whitespace in inline <code> tags will be preserved.
    pub preformatted_code: bool,
}

impl Default for Options {
    fn default() -> Self {
        Self {
            heading_style: HeadingStyle::Atx,
            hr_style: HrStyle::Asterisks,
            br_style: BrStyle::TwoSpaces,
            link_style: LinkStyle::Inlined,
            link_reference_style: LinkReferenceStyle::Full,
            code_block_style: CodeBlockStyle::Fenced,
            code_block_fence: CodeBlockFence::Backticks,
            bullet_list_marker: BulletListMarker::Asterisk,
            preformatted_code: false,
        }
    }
}

#[derive(PartialEq, Debug)]
pub enum HeadingStyle {
    Atx,
    Setex,
}

#[derive(PartialEq, Debug)]
pub enum HrStyle {
    /// `- - -`
    Dashes,
    /// `* * *`
    Asterisks,
    /// `_ _ _`
    Underscores,
}

#[derive(PartialEq, Debug)]
pub enum BrStyle {
    TwoSpaces,
    Backslash,
}

#[derive(PartialEq, Debug)]
pub enum CodeBlockStyle {
    Indented,
    Fenced,
}

#[derive(PartialEq, Debug)]
pub enum CodeBlockFence {
    /// Wrap code with `~~~`
    Tildes,
    /// Wrap code with ```` ``` ````
    Backticks,
}

#[derive(PartialEq, Debug)]
pub enum BulletListMarker {
    /// List items will start with `*`
    Asterisk,
    /// List items will start with `-`
    Dash,
}

#[derive(PartialEq, Debug)]
pub enum LinkStyle {
    Inlined,
    Referenced,
}

#[derive(PartialEq, Debug)]
pub enum LinkReferenceStyle {
    Full,
    Collapsed,
    Shortcut,
}
