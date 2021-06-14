import React, { useState } from 'react'
import { Row, Column } from '../../components/Layout'
import { IconButton, IconButtonProps, MenuItem, useTheme } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'
import { DataObject } from '../../context/Data'
import { useEffect } from 'react'

export default function ChooseInputOutput({
    fields,
    data,
    dataContext,
}: {
    fields: string[]
    data: { [key: string]: any }[]
    dataContext: DataObject
}) {
    const [labels, setLabels] = useState<string[]>(
        dataContext.inputs.keys.length ? dataContext.inputs.keys : ['']
    )
    const [inputs, setInputs] = useState<string[]>(
        dataContext.labels.keys.length ? dataContext.labels.keys : ['']
    )

    useEffect(() => {
        const inputToRemove = dataContext.inputs.keys.find((key) => !inputs.includes(key))
        const labelToRemove = dataContext.labels.keys.find((key) => !labels.includes(key))

        dataContext.removeInput(inputToRemove)
        dataContext.removeLabel(labelToRemove)

        const inputToAdd = inputs.find((key) => !dataContext.inputs.keys.includes(key))
        const labelToAdd = labels.find((key) => !dataContext.labels.keys.includes(key))

        if (inputToAdd) dataContext.addInput({ [inputToAdd]: data.map((obj) => obj[inputToAdd]) })
        if (labelToAdd) dataContext.addLabel({ [labelToAdd]: data.map((obj) => obj[labelToAdd]) })
    }, [data, inputs, labels, dataContext, dataContext.inputs.keys, dataContext.labels.keys])

    return (
        <Row style={{ alignItems: 'flex-start' }}>
            <VectorColumn list={inputs} setList={setInputs} fields={fields} title={'inputs'} />
            <VectorColumn list={labels} setList={setLabels} fields={fields} title={'labels'} />
        </Row>
    )
}

const VectorColumn = ({
    list,
    setList,
    fields,
    title,
}: {
    setList: React.Dispatch<React.SetStateAction<string[]>>
    list: string[]
    fields: string[]
    title: string
}) => {
    const [hover, setHover] = useState(false)

    const handleAdd = () => {
        setList((prev) => [...prev, ''])
    }

    const handleDelete = (i: number) => {
        setList((prev) => {
            prev.splice(i, 1)
            return [...prev]
        })
    }

    return (
        <Column
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{ width: '100%', position: 'relative' }}
        >
            <header>{title}</header>
            {list.map((label, i) => (
                <TextFieldContainer key={i} handleDelete={() => handleDelete(i)}>
                    <TextField
                        id="select-label"
                        value={label}
                        fullWidth
                        select
                        onChange={(e) =>
                            setList((prev) => {
                                prev[i] = e.target.value as string
                                return [...prev]
                            })
                        }
                    >
                        {fields.map((field) => (
                            <MenuItem value={field} key={field}>
                                {field}
                            </MenuItem>
                        ))}
                    </TextField>
                </TextFieldContainer>
            ))}
            <AddButton size="small" visible={hover} onClick={handleAdd}></AddButton>
        </Column>
    )
}

const TextFieldContainer = ({
    children,
    handleDelete,
}: React.ComponentProps<'div'> & { handleDelete: () => void }) => {
    const [hover, setHover] = useState(false)

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                minWidth: '200px',
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <IconButton
                size="small"
                style={{
                    transform: `${hover ? 'scale(0.9)' : 'scale(0)'}`,
                    transition: 'transform .3s',
                }}
                onClick={handleDelete}
            >
                <DeleteIcon />
            </IconButton>

            {children}
        </div>
    )
}

const AddButton = ({ visible, ...props }: IconButtonProps & { visible: boolean }) => {
    const {
        palette: {
            secondary: { contrastText },
        },
        shadows,
    } = useTheme()

    return (
        <IconButton
            {...props}
            style={{
                position: 'absolute',
                bottom: 0,
                transform: `translateY(40%) ${visible ? 'scale(0.9)' : 'scale(0)'}`,
                boxShadow: shadows[1],
                backgroundColor: contrastText,
                transition: 'transform .3s',
            }}
        >
            <AddIcon />
        </IconButton>
    )
}
