# Сервер для мобильной аэропонной установки

## Конечные точки

### _/auth/_

#### POST: _/auth/registration_
Параметры:
```json
{
    "body": {
        "email": "string",
        "username": "string",
        "password": "string"
    }
}
```
Описание:

Регистрация нового пользователя

Возвращаемое значение:
```json
{
    "token": "string"
}
```

___

#### POST: _/auth/login_
Параметры:
```json
{
    "body": {
        "email": "string",
        "password": "string"
    }
}
```
Описание:

Аутенфикация пользователя

Возвращаемое значение:
```json
{
    "token": "string"
}
```


### _/experiment/_

#### GET: _/experiment/_
Параметры:
_/experiment/?id=string_id_string

Описание:
Получить эксперимент по индификатору

Возвращаемое значение:
```json
{
    "experiment": {}
}
```

___

#### POST: _/experiment/new_
Параметры:
```json
{
    "body": {
        "title": "string",
        "description": "string"
    }
}
```

Описание:
Создать новый эксперимент

Возвращаемое значение:
```json
{
    "id": "id_id_id"
}
```

___

#### PATCH: _/experiment/measurement_
Параметры:
```json
{
    "body": {
        "id": "string",
        "measurement": {}
    }
}
```

Описание:

Запись новых результатов экспериментов

Возвращаемое значение:
```json
{
    "experiment": {}
}
```

___

#### PATCH: _/experiment/title
Параметры:
```json
{
    "body": {
        "id": "string",
        "title": "string"
    }
}
```

Описание:

Редактирования названия

Возвращаемое значение:
```json
{
    "experiment": {}
}
```

___

#### PATCH: _/experiment/description_
Параметры:
```json
{
    "body": {
        "id": "string",
        "description": "string"
    }
}
```

Описание:

Редактирвоание описания

Возвращаемое значение:
```json
{
    "experiment": {}
}
```

___


#### GET: _/experiment/list_
Параметры:
_/experiment/list?name=deviceName_
```json
{
    "header": {
        "Authorization": "Bearer token"
    }
}
```

Описание:

Получить эксперимент зарегистрированного устройства по имени

Возвращаемое значение:
```json
{
    "experiment": {}
}
```

### _/device/_
#### GET: _/device/_
_/device/?id=id_id_id_

Описание:

Получить информацию по устройству по индификатору

Возвращаемое значение:
```json
{
     "device": {}
}
```

___

#### GET _/device/list_
Параметры:
```json
{
    "header": {
        "Authorization": "Bearer token"
    }
}
```

Описание:

Получить список устройств зарегистрированного пользователя

Возвращаемое значение:
```json
{
     "devices": [
        {
            "name": "testDevice",
            "description": "description description description",
            "id": "6241ab50b4ac7cd30f5b7c0e"
        },
        {
            "name": "testDevice2",
            "description": "description description description",
            "id": "6241b7a0b4ac7cd30f5b7c22"
        }
    ]
}
```

___

#### POST _/device/new_
Параметры:
```json
{
    "header": {
        "Authorization": "Bearer token"
    },
    "body": {
        "name": "string",
        "passord": "string",
        "description": "string"
    }
}
```

Описание:

Инициализировать новое устройтсво

Возвращаемое значение:
```json
{
     "status": true
}
```

___

#### POST: _/device/experiment_
Параметры:
```json
{
    "header": {
        "Authorization": "Bearer token"
    },
    "body": {
        "id": "string" // индификатор устройства
    }
}
```

Описание:

Завершить текущий эксперимент и начать новый

Возвращаемое значение:
```json
{
     "status": true
}
```

___


#### PATCH: _/device/description_
Параметры:
```json
{
    "header": {
        "Authorization": "Bearer token"
    },
    "body": {
        "id": "string",
        "description": "string"
    }
}
```

Описание:

Изменить описание эксперимента

Возвращаемое значение:
```json
{
     "status": true
}
```

___

#### POST: _/device/experiment-push_
Параметры:
```json
{
    "body": {
        "name": "string",
        "password": "string",
        "measurements": {},
        "date": 11.11.2000
    }
}
```

Описание:

Добавить измерения в текущий экспримент

Возвращаемое значение:
```json
{
     "status": true
}
```

### _/user/_

#### GET _/user/
Параметры:
```json
{
    "header": {
        "Authorization": "Bearer token"
    }
}
```

Описание:

Получить информацию о зарегистрированном пользователя

Возвращаемое значение:
```json
{
     "username": "user"
     {...}
}
```

___

#### POST _/user/password_
Параметры:
```json
{
    "header": {
        "Authorization": "Bearer token"
    },
    "body": {
        "password": "string",
    }
}
```

Описание:

Изменить пароль пользователя

Возвращаемое значение:
```json
{
     "status": true
}
```

___

#### POST _/user/username_
Параметры:
```json
{
    "header": {
        "Authorization": "Bearer token"
    },
    "body": {
        "username": "string",
    }
}
```

Описание:

Изменить имя пользователя

Возвращаемое значение:
```json
{
     "user": {
        "username": "username",
        "email": "user_mail.@mail.ru"
    }
}
```
