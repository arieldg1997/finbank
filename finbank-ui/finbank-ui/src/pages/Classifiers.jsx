import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Grid,
  Typography,
  Box
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

const domainOptions = [
  { value: 'banca-minorista', label: 'Banca Minorista' },
  { value: 'inversiones-seguros', label: 'Inversiones y Seguros' },
  { value: 'operaciones-internas', label: 'Operaciones Internas' },
  { value: 'prestamos-hipotecas', label: 'Préstamos e Hipotecas' }
]
const columnTypeOptions = [
  { value: 'int', label: 'Entero' },
  { value: 'string', label: 'Texto' },
  { value: 'float', label: 'Flotante' },
  { value: 'boolean', label: 'Booleano' }
]
const writeModeOptions = [
  { value: 'append', label: 'Agregar' },
  { value: 'overwrite', label: 'Sobreescribir' }
]

const Classifiers = () => {
  const { user } = useAuth()
  const [classifiers, setClassifiers] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [newClassifier, setNewClassifier] = useState({
    domain: '',
    interface: '',
    writeMode: 'append',
    user: user.username,
    columns: [{ Name: '', Type: 'string' }]
  })

  useEffect(() => {
    fetch('http://localhost:4001/classifier/')
      .then(response => response.json())
      .then(data => setClassifiers(data))
      .catch(err => console.error('Error fetching classifiers:', err))
  }, [])

  const handleDelete = id => {
    // Se asume que existe un endpoint DELETE en http://localhost:4001/classifier/:id
    fetch(`http://localhost:4001/classifier/${id}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          setClassifiers(prev => prev.filter(c => c.id !== id))
        } else {
          console.error('Error deleting classifier')
        }
      })
      .catch(err => console.error(err))
  }

  const handleDialogOpen = () => {
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
    setNewClassifier({
      domain: '',
      interface: '',
      writeMode: 'append',
      columns: [{ Name: '', Type: 'string' }]
    })
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setNewClassifier(prev => ({ ...prev, [name]: value }))
  }

  const handleColumnChange = (index, field, value) => {
    const updatedColumns = [...newClassifier.columns]
    updatedColumns[index][field] = value
    setNewClassifier(prev => ({ ...prev, columns: updatedColumns }))
  }

  const addColumn = () => {
    setNewClassifier(prev => ({
      ...prev,
      columns: [...prev.columns, { Name: '', Type: 'string' }]
    }))
  }

  const removeColumn = index => {
    setNewClassifier(prev => ({
      ...prev,
      columns: prev.columns.filter((col, i) => i !== index)
    }))
  }

  const handleCreate = () => {
    fetch('http://localhost:4001/classifier/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClassifier)
    })
      .then(response => response.json())
      .then(created => {
        newClassifier.createdAt = new Date().toISOString()
        newClassifier.createdBy = user.username
        setClassifiers(prev => [...prev, newClassifier])
        handleDialogClose()
      })
      .catch(err => console.error('Error creating classifier:', err))
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant='h4' gutterBottom>
        Classifiers
      </Typography>
      <Button
        variant='contained'
        startIcon={<AddIcon />}
        onClick={handleDialogOpen}
        sx={{ mb: 2 }}
      >
        Add Classifier
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Domain</TableCell>
            <TableCell>Interface</TableCell>
            <TableCell>Write Mode</TableCell>
            <TableCell>CreatedBy</TableCell>
            <TableCell>CreatedAt</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {classifiers.map(classifier => (
            <TableRow key={classifier.interface}>
              <TableCell>{classifier.domain}</TableCell>
              <TableCell>{classifier.interface}</TableCell>
              <TableCell>{classifier.writeMode}</TableCell>
              <TableCell>{classifier.createdBy}</TableCell>
              <TableCell>{classifier.createdAt}</TableCell>

              <TableCell>
                <IconButton
                  color='error'
                  onClick={() => handleDelete(classifier.interface)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Diálogo para crear un nuevo clasificador */}

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>Nuevo clasificador</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, width: '100%' }}>
            <Typography variant='h6'>Información General</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <Select
                fullWidth
                name='domain'
                value={newClassifier.domain}
                onChange={handleInputChange}
                displayEmpty
              >
                <MenuItem value='' disabled>
                  Seleccionar Dominio
                </MenuItem>
                {domainOptions.map((opt, i) => (
                  <MenuItem key={`domain-${i}`} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name='interface'
                label='Interfaz'
                value={newClassifier.interface}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Select
                fullWidth
                name='writeMode'
                value={newClassifier.writeMode}
                onChange={handleInputChange}
              >
                {writeModeOptions.map((opt, i) => (
                  <MenuItem key={`writeMode-${i}`} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          {/* Sección de columnas */}
          <Box sx={{ mt: 2, width: '100%' }}>
            <Typography variant='h6'>Columnas</Typography>
          </Box>

          <Box sx={{ width: '100%' }}>
            {newClassifier.columns.map((col, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  width: '100%',
                  gap: 2,
                  mt: 1,
                  alignItems: 'center'
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label='Name'
                    value={col.Name}
                    onChange={e =>
                      handleColumnChange(index, 'Name', e.target.value)
                    }
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Select
                    fullWidth
                    value={col.Type}
                    onChange={e =>
                      handleColumnChange(index, 'Type', e.target.value)
                    }
                  >
                    {columnTypeOptions.map((opt, i) => (
                      <MenuItem key={`Type-${i}`} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box sx={{ flexShrink: 0 }}>
                  <Button
                    variant='outlined'
                    color='error'
                    onClick={() => removeColumn(index)}
                    sx={{ minWidth: '100px' }}
                  >
                    Borrar
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button variant='outlined' onClick={addColumn}>
              Agregar Columna
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant='contained' onClick={handleCreate}>
            Create Clasificador
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Classifiers
