<?php

	require "credentials.php";

	// no more complaining you
	date_default_timezone_set('America/Toronto');

	function connect() {
		$DB_HOST = getHost();
		$DB_USER = getUser();
		$DB_PASS = getPass();
		$DB_NAME = getDb();
		
		if (!($conn = @ mysql_connect(getHost(), getUser(), getPass())))
		{
			$err = "Unable to connect to MySQL at $DB_HOST with the DB_USER $DB_USER.  Check your DB_PASS and that the DB_USER has access to MySql at this DB_HOST.";
			die($err);			
		}

		if (!(mysql_select_db($DB_NAME, $conn)))
		{
			$err = "Couldn't select $DB_NAME";
			die($err);	
		}
		
		/*
		* setting the timezone here
		*/
		mysql_query("SET time_zone = '-4:00';", $conn);

		return $conn;
	}

	function logMsg($logType, $msg, $conn) {
		$msg_clean = str_replace("'", "\"", $msg);
		$sql = "insert into baby_log (time, log_type, message) values (current_timestamp, '$logType', '$msg_clean');";
		$res = mysql_query($sql, $conn);
	}

	/* helper to execute sql and deal with errors */
	function getSqlResult($sql) {
		$conn = connect();
		$res = mysql_query($sql, $conn);
		$err = mysql_error($conn);
		if ($err) {
			logMsg('ERROR', $err, $conn);
			die('Sql Error:' . $err);
		}
		return $res;
	}


	function convertSqlRowsToArray($rows) {
		$arr = array();
		while ($row = @ mysql_fetch_array($rows, MYSQL_ASSOC)) 
		{
			array_push($arr, $row);
		}
		return $arr;
	}
	
?>
