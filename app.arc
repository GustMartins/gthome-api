@app
gthome-api

@aws
region us-east-1
profile gthome

# Rotas HTTP
@http
/users
  method any # GET, POST
  src src/http/domain/users

/medias
  method any # GET, POST
  src src/http/domain/medias

# Eventos
@events
dispatch-email
  src src/events/domain/notifications/dispatchEmail

# on-user-create
# on-user-update
# on-user-delete

# Tabelas
@tables
gthome
  PK *String
  SK **String
  Erase TTL

options
  PK *String

# Índices
@tables-indexes
gthome
  PK1 *String
  SK1 **String
  name Segmentos

gthome
  SI *String
  name Slugs
