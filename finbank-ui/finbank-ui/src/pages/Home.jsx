import React from 'react'
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  Card,
  CardMedia,
  CardContent
} from '@mui/material'
import finbankImage from '../assets/finbank-image.webp'

const Home = () => {
  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4} alignItems='center'>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardMedia
              component='img'
              image={finbankImage}
              alt='Finbank Banner'
              sx={{ borderRadius: 2 }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography
                variant='h4'
                gutterBottom
                sx={{ fontFamily: 'monospace' }}
              >
                Bienvenido a Finbank
              </Typography>
              <Typography
                variant='body1'
                paragraph
                sx={{ fontFamily: 'monospace' }}
              >
                Finbank es el banco del futuro, diseñado para transformar el
                mundo financiero a través del Data Mesh. Nuestra plataforma
                integra datos distribuidos y análisis inteligente para impulsar
                decisiones estratégicas en tiempo real.
              </Typography>
              <Typography
                variant='body1'
                paragraph
                sx={{ fontFamily: 'monospace' }}
              >
                Con una arquitectura innovadora, Finbank conecta fuentes de
                datos dispersas, facilitando una visión global y colaborativa
                que potencia la eficiencia y la seguridad en la gestión
                financiera. Únete a la revolución digital y descubre cómo
                estamos redefiniendo la banca.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Home
