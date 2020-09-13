<?php include('pages/header.php') ?>
    <link rel="stylesheet" href="stylesheets/styles.css">
</head>
<body>
<?php require('backend/connection/dbConnection.php'); ?>
    <?php
        session_start();
        if(isset($_SESSION['userType'])){
            include('pages/home.php');
        }else{
            header('Location: pages/signIn.php');
        }
    ?>
<?php include('pages/footer.php') ?>