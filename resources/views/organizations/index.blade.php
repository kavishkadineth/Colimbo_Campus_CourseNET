<!DOCTYPE html>
<html>
<head>
    <title>Organizations</title>
</head>
<body>

    <h1>Organizations</h1>

    <table border="1" cellpadding="10">
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
        </tr>

        @foreach($organizations as $organization)
        <tr>
            <td>{{ $organization->id }}</td>
            <td>{{ $organization->name }}</td>
            <td>{{ $organization->type }}</td>
        </tr>
        @endforeach

    </table>

</body>
</html>