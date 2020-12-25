import { Component } from "react"
import { FileEntry, FileType } from "../vfs/FileSystem"

interface EntryProperties {
    entry: FileEntry | null
}

const STEP_SIZE = 30

export class Entry extends Component<EntryProperties> {

    render() {
        const entry = this.props.entry
        const tags = []
        if (entry) {

            let postfix
            switch (entry.type()) {
                case FileType.Directory:
                    if(entry.name() !== '/')
                        postfix = '/'
                    break
                case FileType.Link:
                    postfix = entry.origin()
                    break
                default:
                    break;
            }

            if(!postfix) {
                postfix = ''
            }

            tags.push(
                <div key="__node__" style={{ paddingLeft: entry.depth() * STEP_SIZE }}>
                    {entry.name()}{postfix} ({entry.properties().join(',')})
                </div>
            )

            for (const child of entry.children()) {
                tags.push(
                    <Entry key={child.name()} entry={child} />
                )
            }
        } else {
            tags.push(<></>)
        }

        return tags;
    }
}

export class FileSystemTree extends Component<EntryProperties> {

    render() {
        return (
            <Entry entry={this.props.entry} />
        )
    }
}

export default FileSystemTree
