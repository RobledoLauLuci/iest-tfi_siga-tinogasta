# Identidad de marca: SIGA · Proyecto de Arte

## Esencia
- **Nombre:** SIGA · Proyecto de Arte, de Laura Robledo (iniciales L.R.).
- **Significado:** SIGA es la sigla de *Sistema Integral de Gestión Artística*; también invita a "seguir" creando.
- **Eslogan (propuesto):** "Cada obra tiene su lugar."
- **Misión:** Dar a las obras y a los talleres de arte un espacio digital propio, donde se puedan ver, comprar y aprender.
- **Visión:** Ser una galería virtual donde artistas de la región publiquen y vendan su trabajo.
- **Personalidad:** cálida, creativa, elegante, sensible y cercana.
- **Público:** personas que compran arte, quienes quieren aprender en talleres y artistas que buscan mostrar su obra.

## Logo
Círculo con borde dorado, trazos de pintura al óleo en rosa y verde agua, monograma **LR** negro con detalles dorados, nombre "Laura Robledo" en caligrafía, "SIGA" en serif con espaciado, subtítulo "Proyecto de Arte", puntos de color, paleta con pinceles y un corazón dorado.

| Versión | Archivo | Uso |
|---|---|---|
| Principal | `marca/logo-siga-lr.png` | Portada, encabezado, informe |
| Mediana | `marca/logo-siga-lr-512.png` | Perfil de redes y tarjetas |
| Ícono | `marca/favicon-64.png` | Favicon del sitio |

## Paleta de colores
| Nombre | HEX | Uso |
|---|---|---|
| Crema Papel | `#FBF5ED` | Fondo dominante (60 %) |
| Negro Tinta | `#080605` | Textos y títulos (30 %) |
| Rosa Pincelada | `#D38E8E` | Acento principal y botones |
| Lila Acuarela | `#B390A7` | Acento secundario |
| Verde Agua | `#8AAAAA` | Detalles y estados informativos |
| Beige Lienzo | `#D3AA84` | Bordes y fondos de tarjetas |
| Dorado Hoja | `#E5A855` | Solo detalles (líneas, íconos); no para texto |

Regla 60-30-10: crema 60 %, negro 30 %, el resto de colores 10 %. El dorado no se usa como color de texto por su bajo contraste sobre crema.

## Tipografías
| Uso | Tipografía |
|---|---|
| Títulos y destacados | Argos George |
| Subtítulos | Aubrey |
| Párrafos y botones | Criselda Caecilia Titus |
| Respaldo web (si falta licencia) | Playfair Display (títulos) y Montserrat (textos) |

## Tono de voz
Cercano y cuidado. Habla de vos, usa frases cortas y evita tecnicismos. Ejemplo: "Descubrí obras únicas y sumate a un taller."

## Variables para el código
Copiar tal cual en `frontend/src/estilos/variables.css`.

```css
:root {
  --color-fondo: #FBF5ED;
  --color-texto: #080605;
  --color-principal: #D38E8E;
  --color-secundario: #B390A7;
  --color-agua: #8AAAAA;
  --color-lienzo: #D3AA84;
  --color-dorado: #E5A855;
  --fuente-titulos: "Argos George", "Playfair Display", serif;
  --fuente-subtitulos: "Aubrey", "Playfair Display", serif;
  --fuente-texto: "Criselda Caecilia Titus", "Montserrat", sans-serif;
  --radio-borde: 8px;
}
```

## El logo: reglas
- Mínimo digital: 64 px de alto.
- No deformar, rotar, recolorear ni agregar sombras.
- Ponerlo solo sobre fondos claros de buen contraste.
