import React, { useState, useEffect } from 'react'
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Chip,
  Box,
  TextField
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

const classificationOptions = ['Sensitive', 'Private', 'Public']
const shareToOptions = [
  { valor: 'share-to-prestamos-hipotecas', etiqueta: 'Préstamos e Hipotecas' },
  { valor: 'share-to-inversiones-seguros', etiqueta: 'Inversiones y Seguros' },
  { valor: 'share-to-operaciones-internas', etiqueta: 'Operaciones Internas' },
  { valor: 'share-to-banca-minorista', etiqueta: 'Banca Minorista' }
]

const obtenerEtiquetaShareTo = valor => {
  const encontrado = shareToOptions.find(opt => opt.valor === valor)
  return encontrado ? encontrado.etiqueta : valor
}

const Metadata = () => {
  const [metadatos, setMetadatos] = useState([])
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [metaActual, setMetaActual] = useState(null)
  const [clasificacion, setClasificacion] = useState('')
  const [shareTo, setShareTo] = useState([])
  const [metadataJson, setMetadataJson] = useState('')

  const cargarMetadatos = () => {
    fetch('http://localhost:4001/classifier/')
      .then(response => response.json())
      .then(data => setMetadatos(data))
      .catch(err => console.error('Error fetching metadata:', err))
  }

  useEffect(() => {
    cargarMetadatos()
  }, [])

  const abrirEditar = meta => {
    setMetaActual(meta)
    setClasificacion(meta.classification || '')
    setShareTo(meta.shareTo || [])
    setMetadataJson(
      meta.metadata ? JSON.stringify(meta.metadata, null, 2) : '{}'
    )
    setDialogoAbierto(true)
  }

  const cerrarDialogo = () => {
    setDialogoAbierto(false)
    setMetaActual(null)
    setClasificacion('')
    setShareTo([])
    setMetadataJson('')
  }

  const guardar = () => {
    if (!metaActual) return
    let metadataParseada = {}
    try {
      metadataParseada = JSON.parse(metadataJson)
    } catch (error) {
      alert('JSON de metadata inválido')
      return
    }
    const payload = {
      schema: `${metaActual.domain}_staging`,
      table: metaActual.interface,
      classification: clasificacion,
      shareTo,
      metadata: metadataParseada
    }
    fetch('http://localhost:4002/metadata/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(() => {
        cargarMetadatos()
        cerrarDialogo()
      })
      .catch(err => console.error('Error updating metadata:', err))
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant='h4' gutterBottom>
        Metadata
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align='center'>Tabla</TableCell>
            <TableCell align='center'>Compañía</TableCell>
            <TableCell align='center'>Privacidad</TableCell>
            <TableCell align='center'>Compartido con</TableCell>
            <TableCell align='center'>Editar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {metadatos.map((meta, index) => (
            <TableRow key={meta.id ? meta.id : `meta-${index}`}>
              <TableCell align='center'>{meta.interface}</TableCell>
              <TableCell align='center'>{meta.domain || 'N/A'}</TableCell>
              <TableCell align='center'>
                {meta.classification ? (
                  <Chip
                    label={meta.classification}
                    size='small'
                    sx={{ mr: 0.5 }}
                  />
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell align='center'>
                {meta.shareTo
                  ? meta.shareTo
                      .filter(tag => tag !== `share-to-${meta.domain}`)
                      .map((tag, i) => (
                        <Chip
                          key={`shareto-${i}`}
                          label={obtenerEtiquetaShareTo(tag)}
                          size='small'
                          sx={{ mr: 0.5 }}
                        />
                      ))
                  : '-'}
              </TableCell>
              <TableCell align='center'>
                <IconButton color='primary' onClick={() => abrirEditar(meta)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={dialogoAbierto}
        onClose={cerrarDialogo}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Editar Tags de Metadata</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id='clasificacion-label'>Clasificación</InputLabel>
              <Select
                labelId='clasificacion-label'
                value={clasificacion}
                label='Clasificación'
                onChange={e => setClasificacion(e.target.value)}
              >
                {classificationOptions.map((opcion, idx) => (
                  <MenuItem key={idx} value={opcion}>
                    {opcion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id='shareto-label'>Share To</InputLabel>
              <Select
                labelId='shareto-label'
                multiple
                value={shareTo}
                label='Share To'
                onChange={e => setShareTo(e.target.value)}
                renderValue={selected =>
                  selected.map(val => obtenerEtiquetaShareTo(val)).join(', ')
                }
              >
                {metaActual
                  ? shareToOptions
                      .filter(
                        opcion =>
                          opcion.valor !== `share-to-${metaActual.domain}`
                      )
                      .map((opcion, idx) => (
                        <MenuItem key={idx} value={opcion.valor}>
                          {opcion.etiqueta}
                        </MenuItem>
                      ))
                  : shareToOptions.map((opcion, idx) => (
                      <MenuItem key={idx} value={opcion.valor}>
                        {opcion.etiqueta}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label='Metadata (JSON)'
              value={metadataJson}
              onChange={e => setMetadataJson(e.target.value)}
              multiline
              minRows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDialogo}>Cancelar</Button>
          <Button variant='contained' onClick={guardar}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Metadata
